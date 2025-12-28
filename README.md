# MusicGPT Prompt-to-Music UI Simulation

## Overview
A polished "Create Music" experience that mirrors MusicGPT's prompt-to-music workflow, including animated prompt input, live WebSocket progress updates, and synchronized recent generations across the profile popup and bottom panel.

## Chosen Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Node.js (custom Next server)
- Socket.io (real-time sync)
- Zustand (global state)

## Architecture Rationale
- REST endpoints (`app/api/generate`, `app/api/paginate`) simulate prompt submission and pagination.
- A custom Next server (`server/index.js`) attaches Socket.io on `/ws` for real-time events.
- `server/simulator.js` emits progress, completion, and failure events that update the UI.
- Zustand (`lib/music-store.ts`) is the single source of truth for generation state.
- `components/music-provider.tsx` subscribes to WS events and updates the store, keeping the Profile Popup and Recent Generations panel in sync.
- The floating player reads from the same store to preserve play/pause state across the UI.

## How to Build & Run the Project
```bash
npm install
npm run dev
```

This starts the Next.js app and socket.io server on `http://localhost:3000`.

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
The animation timing below matches the implemented values that were tuned to the Figma prototype:
- Prompt shell height transition: 200ms (`transition-[height] duration-200`).
- Placeholder swap: 3.2s cycle with 260ms fade/slide (`setInterval(3200)` + `setTimeout(260)`).
- Animated border (prompt box): 10s linear gradient sweep (`Anim12Motion 10s linear infinite`).
- Progress bar width: 300ms ease linear (`transition-all duration-300 ease-linear`).
- Spinning gradient on generation thumb: 6s and 4s linear rotations (`SpinningGradient1`).
- Pulsating dot: 2s ease-in-out (`scaleInAnim 2s ease-in-out infinite`).
- Profile panel open/close: 300ms (`transition-all duration-300`).
- Tools button border spin: 3s linear (`animate-rotateGradient`).
