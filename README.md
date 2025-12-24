# MusicGPT Prompt-to-Music UI Simulation

## Overview
A polished “Create Music” experience that mirrors MusicGPT’s prompt-to-music workflow, including animated prompt input, live WebSocket progress updates, and synchronized recent generations across the profile popup and bottom panel.

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Node.js (Express + ws)
- WebSockets for realtime state

## Architecture
- `app/` hosts the UI and layout. The main screen composes the prompt box, profile popup, and recent generations panel.
- `components/music-context.tsx` owns global state, WebSocket subscription, and REST submission helpers.
- `server/index.js` is a lightweight mock server that accepts prompt submissions, emits generation progress over WebSockets, and simulates pagination.

## Running Locally
```bash
npm install
npm run dev
```

This starts:
- Next.js UI on `http://localhost:3000`
- Mock server on `http://localhost:4000`

## Build + Start
```bash
npm run build
npm start
```

## Environment Variables (Optional)
```bash
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws
PORT=4000
```

## Design Notes
- The prompt box expands on focus and animates its border on first render.
- Profile popup and recent generations are driven from the same state store for real-time sync.
- All generation states are represented: empty, generating, completed, failed, and pagination.
