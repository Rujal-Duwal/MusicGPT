# MusicGPT Prompt-to-Music UI Simulation

## Overview
A polished “Create Music” experience that mirrors MusicGPT’s prompt-to-music workflow, including animated prompt input, live WebSocket progress updates, and synchronized recent generations across the profile popup and bottom panel.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Node.js (custom Next server)
- Socket.io (real-time sync)
- Zustand (global state)

## Architecture
- `app/` hosts the UI and layout. The main screen composes the prompt box, profile popup, and recent generations panel.
- `lib/music-store.ts` owns the global state and REST submission helpers (Zustand).
- `components/music-provider.tsx` wires socket.io events into the store for real-time sync.
- `server/index.js` boots the Next.js app and attaches socket.io for real-time events.
- `app/api/*` route handlers simulate prompt submissions and pagination, emitting socket.io events.

## Running Locally
```bash
npm install
npm run dev
```

This starts the Next.js app and socket.io server on `http://localhost:3000`.

## Build + Start
```bash
npm run build
npm start
```

## Environment Variables (Optional)
```bash
NEXT_PUBLIC_WS_URL=http://localhost:3000
PORT=3000
```

## Design Notes
- The prompt box expands on focus and animates its border on first render.
- Profile popup and recent generations are driven from the same state store for real-time sync.
- All generation states are represented: empty, generating, completed, failed, and pagination.
