# Personal Website
Dies ist die aktuellste und vorerst fertige Version der persoenlichen Webseite.

## Ueberblick
- Statische Inhalte liegen in `public/`.
- `public/index.html` laedt `public/content.html` per IFrame.
- Der Node/Express-Server in `server.js` dient fuer lokale Starts und einen optionalen Proxy.

## Lokal starten
1. `npm install`
2. `npm start`
3. `http://localhost:3000` im Browser oeffnen

Hinweis: Wenn der Port belegt ist, wechselt der Server automatisch auf den naechsten freien Port.

## Konfiguration (optional)
- `PORT`: HTTP-Port (Standard 3000)
- `HTTPS=true`: aktiviert HTTPS (Zertifikate erforderlich)
- `SSL_PORT`: HTTPS-Port (Standard 3443)
- `SSL_KEY_PATH`: Pfad zum privaten Schluessel
- `SSL_CERT_PATH`: Pfad zum Zertifikat
- `PROXY_PREFIX`: Standard `/api`
- `PROXY_TARGET`: Ziel-URL fuer den Entwicklungs-Proxy

## Struktur
- `public/index.html`: Einstiegspunkt inkl. Meta-Tags
- `public/content.html`: eigentliche Seiteninhalte
- `public/img/`: Bilder/Assets
- `server.js`: Express-Server mit Static-Hosting, Health-Check (`/health`) und optionalem Proxy
