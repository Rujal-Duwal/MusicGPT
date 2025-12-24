const express = require('express');
const http = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const clients = new Set();
const generations = [];

const moods = ['noir', 'uplift', 'ambient', 'storm', 'neon'];
const palettes = [
  ['#FBD786', '#f7797d'],
  ['#a1ffce', '#faffd1'],
  ['#84fab0', '#8fd3f4'],
  ['#fbc2eb', '#a6c1ee'],
  ['#f6d365', '#fda085']
];

const createVersion = (label) => {
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  return {
    id: crypto.randomUUID(),
    title: label,
    duration: `${crypto.randomInt(1, 4)}:${crypto.randomInt(0, 59).toString().padStart(2, '0')}`,
    bpm: crypto.randomInt(80, 142),
    key: `${String.fromCharCode(65 + crypto.randomInt(0, 7))}m`,
    mood: moods[Math.floor(Math.random() * moods.length)],
    palette
  };
};

const createCompletedItem = (prompt, createdAt) => ({
  id: crypto.randomUUID(),
  prompt,
  status: 'completed',
  progress: 100,
  createdAt,
  versions: [createVersion('Version A'), createVersion('Version B')]
});

const broadcast = (type, payload) => {
  const message = JSON.stringify({ type, payload });
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

const updateGeneration = (id, patch) => {
  const index = generations.findIndex((item) => item.id === id);
  if (index === -1) return;
  generations[index] = { ...generations[index], ...patch };
};

const startSimulation = (itemId) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress = Math.min(100, progress + crypto.randomInt(8, 16));
    updateGeneration(itemId, { status: 'generating', progress });
    broadcast('generation:progress', { id: itemId, progress });

    if (progress >= 100) {
      clearInterval(interval);
      const failed = Math.random() < 0.18;
      if (failed) {
        const error = 'Render failed. A glitch hit the audio graph.';
        updateGeneration(itemId, { status: 'failed', error, progress: 100 });
        broadcast('generation:failed', { id: itemId, error });
      } else {
        const versions = [createVersion('Version A'), createVersion('Version B')];
        updateGeneration(itemId, { status: 'completed', progress: 100, versions });
        broadcast('generation:completed', { id: itemId, versions });
      }
    }
  }, 650);
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', (req, res) => {
  const prompt = String(req.body?.prompt || '').trim();
  if (!prompt) {
    res.status(400).json({ ok: false, error: 'Prompt required.' });
    return;
  }

  const item = {
    id: crypto.randomUUID(),
    prompt,
    status: 'queued',
    progress: 0,
    createdAt: Date.now()
  };

  generations.unshift(item);
  broadcast('generation:queued', item);

  setTimeout(() => startSimulation(item.id), 600);

  res.json({ ok: true, id: item.id });
});

app.post('/api/paginate', (_req, res) => {
  broadcast('pagination:start');

  setTimeout(() => {
    const baseTime = generations[generations.length - 1]?.createdAt || Date.now();
    const newItems = Array.from({ length: 3 }).map((_, index) =>
      createCompletedItem(
        `Archived prompt ${generations.length + index + 1}`,
        baseTime - (index + 1) * 60000
      )
    );

    generations.push(...newItems);
    broadcast('pagination:complete', { items: newItems });
  }, 1400);

  res.json({ ok: true });
});

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(
    JSON.stringify({
      type: 'connection:ready',
      payload: { items: generations.slice(0, 6) }
    })
  );

  ws.on('close', () => {
    clients.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`MusicGPT mock server running on http://localhost:${PORT}`);
});
