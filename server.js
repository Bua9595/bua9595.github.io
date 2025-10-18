const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const url = require('url');
const express = require('express');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const SSL_PORT = Number(process.env.SSL_PORT || 3443);
const PROXY_PREFIX = process.env.PROXY_PREFIX || '/api';
const PROXY_TARGET = process.env.PROXY_TARGET || '';

// Simple request logging middleware (no external deps)
app.use((req, res, next) => {
  const start = Date.now();
  const { method, url: reqUrl } = req;
  res.on('finish', () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    console.log(`${method} ${reqUrl} -> ${status} ${ms}ms`);
  });
  next();
});

// Optional dev proxy without extra dependencies
if (PROXY_TARGET) {
  const targetUrl = new URL(PROXY_TARGET);
  app.use((req, res, next) => {
    if (!req.url.startsWith(PROXY_PREFIX)) return next();

    const original = new URL(req.url, 'http://local');
    const strippedPath = req.url.slice(PROXY_PREFIX.length) || '/';
    const pathWithQuery = strippedPath + (original.search || '');

    const isHttps = targetUrl.protocol === 'https:';
    const client = isHttps ? https : http;

    const options = {
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port || (isHttps ? 443 : 80),
      method: req.method,
      path: pathWithQuery,
      headers: { ...req.headers, host: targetUrl.host }
    };

    const proxyReq = client.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err.message);
      if (!res.headersSent) res.statusCode = 502;
      res.end('Bad Gateway');
    });

    req.pipe(proxyReq);
  });
}

// Serve static files from the public directory
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Health check (optional)
app.get('/health', (_req, res) => {
  res.status(200).send('ok');
});

// Root -> serve index.html
app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// SPA-style HTML fallback: use a RegExp catch-all (Express 5 no longer accepts bare "*")
app.get(/.*/, (req, res, next) => {
  const accept = req.headers.accept || '';
  if (req.method === 'GET' && accept.includes('text/html')) {
    return res.sendFile(path.join(publicDir, 'index.html'));
  }
  next();
});

// 404 for anything else
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  res.status(err && err.status ? err.status : 500).json({ error: 'Internal Server Error' });
});

// Try to start a server, bumping the port forward when it is already taken.
async function listenWithRetry(createServer, preferredPort, options = {}) {
  const {
    maxAttempts = 10,
    step = 1,
    label = 'Server'
  } = options;

  let attemptPort = preferredPort;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const server = createServer();

    try {
      await new Promise((resolve, reject) => {
        const handleError = (err) => {
          server.off('listening', handleListening);
          reject(err);
        };
        const handleListening = () => {
          server.off('error', handleError);
          resolve();
        };

        server.once('error', handleError);
        server.once('listening', handleListening);
        server.listen(attemptPort);
      });

      const address = server.address();
      const actualPort =
        address && typeof address === 'object' ? address.port : attemptPort;

      if (preferredPort && actualPort !== preferredPort) {
        console.warn(`${label} port ${preferredPort} in use, switched to ${actualPort}`);
      }

      return { server, port: actualPort };
    } catch (err) {
      if (err && err.code !== 'EADDRINUSE') {
        throw err;
      }

      try {
        server.close();
      } catch (_) {
        // ignore
      }

      attemptPort += step;
    }
  }

  throw new Error(`${label} failed to find an open port (starting at ${preferredPort})`);
}

async function startServers() {
  try {
    const { port: httpPort } = await listenWithRetry(
      () => http.createServer(app),
      PORT,
      { label: 'HTTP server' }
    );
    console.log(`HTTP server running at http://localhost:${httpPort}`);
  } catch (err) {
    console.error('Unable to start HTTP server:', err && err.message ? err.message : err);
    process.exit(1);
  }

  if (String(process.env.HTTPS).toLowerCase() === 'true') {
    const keyPath = process.env.SSL_KEY_PATH || path.join(__dirname, 'cert', 'dev.key');
    const certPath = process.env.SSL_CERT_PATH || path.join(__dirname, 'cert', 'dev.crt');
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      const sslOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
      };

      try {
        const { port: httpsPort } = await listenWithRetry(
          () => https.createServer(sslOptions, app),
          SSL_PORT,
          { label: 'HTTPS server' }
        );
        console.log(`HTTPS server running at https://localhost:${httpsPort}`);
      } catch (err) {
        console.error('Unable to start HTTPS server:', err && err.message ? err.message : err);
      }
    } else {
      console.warn('HTTPS requested but cert files not found. Expected:', keyPath, certPath);
    }
  }
}

startServers();
