# Social Connectivity Platform

A community web app for self-expression, social connection, and community participation — expressive profiles, posts, personalized feed, discovery, 1:1 messaging, events, and notifications in one place.

> **Stack:** HTML + CSS + plain JavaScript ES modules (no UI framework), Vite 6 for dev/build, Node.js + `ws` for an optional real-time gateway.

## Features

**Accounts & Onboarding**
- Email sign-up / sign-in with local demo storage, provider OAuth demo flow (PKCE display), password visibility toggle, help dialog
- 3-step profile setup: identity → interests → visibility preferences

**Feed & Social**
- Text / image posts (2 MB limit), likes, threaded comments, share / copy link, connections
- Creator / topic / content search with empty states
- People suggestions + connect / remove, community events + RSVP + attendee counts
- Notifications / activity feed with live gateway events
- Editable profile with avatar, bio, interests, activity heatmap

**Messaging**
- Direct messages with presence, typing indicators, read receipts
- Voice notes (MediaRecorder, 60s max, requires localhost/HTTPS + mic permission)
- 3 seeded contacts with simulated gateway replies; without gateway, messages are marked `LOCAL`

**UX / Platform**
- Command palette (`Ctrl+K` / `Cmd+K`), responsive rail + mobile bottom nav, native accessible `<dialog>` + toasts
- WebGL fiber background + alternate ocean gradient, `prefers-reduced-motion` support

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS (`src/index.css`, `src/app.css`), vanilla JS ES modules |
| Browser APIs | DOM, WebSocket, WebGL, MediaRecorder, Clipboard, localStorage, native `dialog` |
| Dev / Build | Vite 6 (`dev`, `build`, `preview`) |
| Realtime (optional) | Node.js + `ws` WebSocket gateway on port `4001` |
| Runtime | Node.js 20.19+ or 22.12+ |

No frontend UI framework or runtime UI libraries.

## Getting Started

Run from the project root (folder containing `index.html`):

```sh
npm install
npm run dev
```

Open the URL Vite prints (normally `http://localhost:5173`).

For live messages, typing indicators, presence, likes, and post broadcasts, open a second terminal:

```sh
npm run server
# auto-restart on server changes:
npm run server:dev
```

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run server` | Start realtime gateway (`server/server.js`) |
| `npm run server:dev` | Start gateway with `node --watch` |

### Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_WS_URL` | `ws://localhost:4001` | WebSocket endpoint used by frontend |
| `PORT` | `4001` | Port for `server/server.js` gateway |

Example:

```sh
PORT=4001 node server/server.js
VITE_WS_URL=ws://localhost:4001 npm run dev
```

## Project Structure

```
.
├── index.html              # Entry, stylesheets, canvas bg, dialog, toasts
├── public/
│   ├── logo.png
│   └── ocean-gradient.jpg
├── src/
│   ├── main.js             # App state, routing, DOM events, persistence
│   ├── views.js            # HTML templates for screens / dialogs
│   ├── data.js             # Seed posts, contacts, topics, events, comments
│   ├── ui.js               # Escaping, SVG icons, avatars, toasts
│   ├── background.js       # Native WebGL fiber background
│   ├── index.css / app.css # Theme, layouts, responsive, animations
│   ├── services/
│   │   ├── authService.js  # Local demo accounts + sessions
│   │   └── socketService.js# Native WebSocket + reconnect logic
│   ├── components/         # comments, common, navigation, onboarding, profile, shell
│   ├── context/ assets/
├── server/
│   ├── server.js           # Optional realtime gateway (in-memory)
│   └── test_realtime.js
├── Config/                 # Reference copies of package.json + vite.config.js
├── vite.config.js
├── package.json
├── PRODUCT_DOCUMENT.md / Product\ Requirements\ Document.md
├── System\ Design\ Document.md
├── PROJECT_DOCUMENT.md
└── dist/                   # Build output (generated)
```

> Active config is the root `package.json` / `vite.config.js`. `Config/` holds matching reference copies.

## How It Works

- **Auth:** demo accounts + sessions in browser `localStorage` (original storage keys retained). OAuth/JWT/password-reset are demo-only — no real email or identity provider.
- **Feed:** local seed data + per-account persistence, live like/post broadcasts when gateway is connected.
- **Messaging:** WebSocket gateway keeps presence + in-memory conversations. Seeded contacts auto-reply via gateway. Offline messages stay `LOCAL` and are not auto-retried.
- **Media:** post images validated client-side (≤2 MB). Remote fonts / Unsplash sample images need internet.

## Build & Deploy

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` to any static host. To serve without building, use a static HTTP server from the project root that maps `/logo.png` and `/ocean-gradient.jpg` to `public/`. Always use HTTP (not `file://`) — the app uses ES modules.

## Demo Scope & Limits

- Accounts + per-account data are per-browser `localStorage`.
- Gateway data is in-memory and resets on restart.
- Visibility preferences, password reset, OAuth are UI demos only.
- Voice recording: localhost/HTTPS + mic permission, 60s limit.
- Post images: 2 MB limit. Remote fonts/images require internet.

## Docs

- `PROJECT_DOCUMENT.md` — business idea, users, features, stack, setup
- `Product Requirements Document.md` — MVP PRD (personas, FR-001…FR-083, ranking, metrics, release plan)
- `System Design Document.md` — target distributed architecture (feed fanout, messaging, media pipeline, schema, APIs)

The SDD describes the broader production target; the current implementation is the local Vite + vanilla-JS demo + optional `ws` gateway.

## Requirements

- Node.js 20.19+ or 22.12+
- Modern desktop/mobile browser with ES modules, WebSocket, WebGL
- Internet for Google Fonts + sample images (optional)
- Microphone permission for voice notes (optional)

## License

Private / academic demo — no license file included. Add one if you plan to distribute.
