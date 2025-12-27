const http = require('http');
const next = require('next');
const { Server } = require('socket.io');
const { setIO } = require('./socket');
const { getGenerations } = require('./store');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: '/ws',
    cors: {
      origin: '*'
    }
  });

  setIO(io);

  io.on('connection', (socket) => {
    socket.emit('connection:ready', {
      items: getGenerations().slice(0, 6)
    });
  });

  server.listen(port, () => {
    console.log(`MusicGPT UI running on http://localhost:${port}`);
  });
});
