# Social Connectivity Platform

The frontend uses **HTML, CSS, and plain JavaScript**, with native browser APIs and no UI framework or frontend runtime libraries.

## Run locally

Use Node.js 20.19+ or 22.12+. Run commands from the project root (the folder containing `index.html`):

```sh
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). Vite is a development/build tool; the browser runs regular JavaScript ES modules.

For live messages, typing indicators, presence, likes, and post broadcasts, open a second terminal:

```sh
npm run server
```

The optional JavaScript gateway listens on port `4001` and uses the server-side `ws` package. `npm run server:dev` restarts it when server code changes. Set `VITE_WS_URL` to use a different WebSocket endpoint.

## Build

```sh
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static web server. The unbuilt frontend can also be served from the project root by a static HTTP server that maps `/logo.png` and `/ocean-gradient.jpg` to the corresponding files in `public/`. Use HTTP rather than opening `index.html` directly, because the frontend uses ES modules.

## Features

- Email sign-up/sign-in, provider-flow demos, password visibility, and help dialog.
- Three-step profile setup: identity, interests, and visibility preferences.
- Feed with text/image posts, likes, threaded comments, sharing, and connections.
- Creator/topic search, community events and RSVPs, notifications, editable profile, and activity heatmap.
- Direct messages, typing/read status, and voice recording/playback using native browser controls.
- Keyboard command palette (`Ctrl+K` / `Cmd+K`), responsive navigation, and native accessible dialogs.
- WebGL fiber background and an alternate ocean gradient, with reduced-motion support.

Accounts and per-account demo data are stored in this browser’s local storage. The original account storage keys are retained. OAuth, JWT, password reset, and visibility preferences remain demo flows; password-reset email and production identity services are not connected. The three seeded messaging contacts use simulated replies from the gateway. Without the gateway, messages are explicitly marked `LOCAL` and are not sent automatically on reconnection. Gateway data is in memory and resets when the server restarts.

Voice recording requires microphone permission on localhost or HTTPS and is limited to 60 seconds. Post images are limited to 2 MB. Remote fonts and sample images need an internet connection.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page entry, stylesheets, background canvas, dialog, and notifications |
| `src/main.js` | Application state, DOM event handlers, navigation, and persistence |
| `src/views.js` | HTML templates for the app’s screens |
| `src/index.css`, `src/app.css` | Theme, layouts, responsive styles, and animations |
| `src/data.js` | Seed content and navigation/topic definitions |
| `src/ui.js` | Escaping, SVG icons, avatars, and toast helpers |
| `src/background.js` | Native WebGL background |
| `src/services/authService.js` | Local demo accounts and sessions |
| `src/services/socketService.js` | Native WebSocket connection and reconnection |
| `server/server.js` | Optional real-time gateway |

The package/config files in the root are the active setup. `Config/` contains matching reference copies.
