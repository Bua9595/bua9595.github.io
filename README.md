# Persoenliche Website

Statische Website mit kleinem Node-Server fuer lokales Testen.

## Struktur
- Statische Seiten liegen in `public/`.
- Einstiegspunkt des Node-Servers ist `server.js`.
- `public/index.html`: Vollstaendige Seite (HTML/CSS/JS direkt)
- `public/img/`: Bilder/Assets
- `public/robots.txt`: Crawler-Direktiven
- `public/sitemap.xml`: Sitemap fuer Suchmaschinen

## Voraussetzungen
- Node.js (LTS empfohlen)

## Schnellstart (Windows / PowerShell)
1) Terminal im Projektordner oeffnen.
2) Abhaengigkeiten installieren:
```powershell
npm install
```
3) Server starten:
```powershell
npm run start
```
4) Browser oeffnen:
- Standard: `http://localhost:3000`
- Wenn 3000 belegt ist, wechselt der Server automatisch auf den naechsten freien Port.

## Hinweise
- Das Label ```sh``` in Codebloecken bedeutet "Shell-Befehl" und ist nur zur Hervorhebung.
- Alternativ kannst du direkt starten mit:
```powershell
node server.js
```

## Optionale Einstellungen (ENV)
- `PORT`: HTTP-Port (Standard 3000)
- `HTTPS=true`: startet HTTPS, wenn Zertifikate vorhanden sind
- `SSL_PORT`: HTTPS-Port (Standard 3443)
- `SSL_KEY_PATH`, `SSL_CERT_PATH`: Pfade zu Zertifikaten
- `PROXY_PREFIX`: Pfad-Prefix fuer Proxy (Standard `/api`)
- `PROXY_TARGET`: Ziel-URL fuer Proxy, z. B. `https://api.example.com`
