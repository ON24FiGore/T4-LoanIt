# LoanIt

Eine moderne Webanwendung zur Verwaltung und zum Verleih von Gegenständen. Entwickelt mit Vue.js 3 (Frontend) und Deno mit Oak Framework (Backend).

## 🚀 Features

- **Benutzerauthentifizierung**: Registrierung und Login
- **Gegenstände verwalten**: Eigene Gegenstände hinzufügen, anzeigen und löschen
- **Ausleihen**: Verfügbare Gegenstände anderer Nutzer finden und ausleihen
- **Rückgabe**: Ausgeliehene Gegenstände einfach zurückgeben
- **Status-Übersicht**: Visuelle Anzeige des Verfügbarkeitsstatus

## 📋 Voraussetzungen

- **Docker** und **Docker Compose** (empfohlen für einfache Installation)
  - [Docker Desktop](https://www.docker.com/products/docker-desktop/) installieren
- Oder manuell:
  - **Node.js** (Version 20.19.0 oder höher, oder 22.12.0+)
  - **Deno** (neueste Version)

## 🐳 Installation mit Docker (Empfohlen)

### Schritt 1: Repository klonen

```bash
git clone <repository-url>
cd LoanIt
```

### Schritt 2: Docker Container starten

```bash
docker-compose up -d
```

Dies startet automatisch:
- **Backend** auf Port `3000`
- **Frontend** auf Port `8080`

### Schritt 3: Anwendung öffnen

Öffnen Sie Ihren Browser und navigieren Sie zu:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000

### Container verwalten

```bash
# Container stoppen
docker-compose down

# Container stoppen und Volumes löschen (⚠️ löscht alle Daten)
docker-compose down -v

# Logs anzeigen
docker-compose logs -f

# Container neu bauen (nach Code-Änderungen)
docker-compose up -d --build
```

## 💻 Manuelle Installation (ohne Docker)

### Backend einrichten

1. **Deno installieren** (falls noch nicht installiert):
   ```bash
   # Windows (PowerShell)
   irm https://deno.land/install.ps1 | iex
   
   # macOS/Linux
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Backend starten**:
   ```bash
   deno task dev
   ```
   
   Oder manuell:
   ```bash
   deno run --watch --unstable-kv --allow-net main.ts
   ```

   Das Backend läuft nun auf http://localhost:3000

### Frontend einrichten

1. **Dependencies installieren**:
   ```bash
   npm install
   ```

2. **Umgebungsvariable setzen** (optional):
   
   Erstellen Sie eine `.env` Datei im Root-Verzeichnis:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Development Server starten**:
   ```bash
   npm run dev
   ```
   
   Das Frontend läuft nun auf http://localhost:5173 (oder einem anderen Port, den Vite zuweist)

4. **Production Build** (optional):
   ```bash
   npm run build
   npm run preview
   ```

## 🔧 Konfiguration

### Umgebungsvariablen

#### Frontend (Vite)

Erstellen Sie eine `.env` Datei im Root-Verzeichnis:

```env
# API Base URL (Standard: http://localhost:3000)
VITE_API_URL=http://localhost:3000
```

**Hinweis**: In Docker wird diese Variable automatisch über `docker-compose.yml` gesetzt.

#### Backend (Deno)

Das Backend verwendet standardmäßig Port `3000`. Dies kann in `main.ts` geändert werden.

### Ports ändern

#### Docker

Bearbeiten Sie `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3001:3000"  # Host:Container
  frontend:
    ports:
      - "8081:80"    # Host:Container
```

Dann die `VITE_API_URL` im Frontend-Service anpassen:
```yaml
environment:
  - VITE_API_URL=http://localhost:3001
```

#### Manuell

- **Backend**: Port in `main.ts` ändern
- **Frontend**: Port in `vite.config.js` konfigurieren

## 📁 Projektstruktur

```
LoanIt/
├── src/                    # Frontend (Vue.js)
│   ├── components/        # Vue-Komponenten
│   ├── views/             # Seiten-Komponenten
│   ├── router/            # Vue Router Konfiguration
│   ├── config.js          # API-Konfiguration
│   └── main.js            # Entry Point
├── main.ts                # Backend Entry Point (Deno)
├── *.routes.ts            # API Routes
├── Dockerfile.backend     # Backend Docker Image
├── Dockerfile.frontend    # Frontend Docker Image
├── docker-compose.yml     # Docker Compose Konfiguration
├── nginx.conf             # Nginx Konfiguration (für Frontend)
└── package.json           # Frontend Dependencies
```

## 🛠️ Entwicklung

### Code linten

```bash
npm run lint
```

### Hot Reload

- **Frontend**: Vite bietet automatisches Hot Reload
- **Backend**: Deno Watch-Modus (mit `--watch` Flag)

### Datenbank

Das Projekt verwendet **Deno KV** als Datenbank. Daten werden persistent gespeichert:
- **Docker**: In einem Docker Volume (`deno-kv-data`)
- **Manuell**: Im lokalen Dateisystem (Deno KV speichert automatisch)

## 🐛 Troubleshooting

### Docker-Probleme

**Container startet nicht:**
```bash
# Logs prüfen
docker-compose logs

# Container neu bauen
docker-compose up -d --build
```

**Port bereits belegt:**
- Ändern Sie die Ports in `docker-compose.yml`
- Oder stoppen Sie den Prozess, der den Port verwendet

**Daten gehen verloren:**
- Docker Volumes werden standardmäßig beibehalten
- Bei `docker-compose down -v` werden Volumes gelöscht

### Manuelle Installation - Probleme

**Backend startet nicht:**
- Stellen Sie sicher, dass Deno installiert ist: `deno --version`
- Prüfen Sie, ob Port 3000 frei ist
- Führen Sie `deno cache main.ts` aus, um Dependencies zu laden

**Frontend startet nicht:**
- Stellen Sie sicher, dass Node.js installiert ist: `node --version`
- Führen Sie `npm install` aus
- Prüfen Sie, ob der Backend-Server läuft

**API-Verbindungsfehler:**
- Prüfen Sie die `VITE_API_URL` in der `.env` Datei
- Stellen Sie sicher, dass das Backend läuft
- Prüfen Sie CORS-Einstellungen im Backend

## 📚 Technologien

- **Frontend**: Vue.js 3, Vue Router, Vue Final Modal, Vite
- **Backend**: Deno, Oak Framework, Deno KV
- **Container**: Docker, Docker Compose, Nginx

## 📝 API-Endpunkte

### Items
- `GET /items` - Alle Gegenstände abrufen
- `GET /items/:id` - Einzelnen Gegenstand abrufen
- `POST /items` - Neuen Gegenstand erstellen
- `PATCH /items/:id` - Gegenstand aktualisieren
- `DELETE /items/:id` - Gegenstand löschen

### Users
- `POST /users/register` - Neuen Benutzer registrieren
- `POST /users/login` - Benutzer anmelden

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## 📄 Lizenz

Dieses Projekt ist für Bildungszwecke erstellt.

## 👨‍💻 Entwickler

Für Fragen oder Probleme öffnen Sie bitte ein Issue im Repository.

---

## 🚀 Quick Start (Zusammenfassung)

**Mit Docker:**
```bash
docker-compose up -d
# Öffne http://localhost:8080
```

**Ohne Docker:**
```bash
# Terminal 1: Backend
deno task dev

# Terminal 2: Frontend
npm install
npm run dev
# Öffne http://localhost:5173
```

Viel Erfolg mit LoanIt! 🎉
