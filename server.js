const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).substr(2, 9);
  clients[id] = { x: 50, y: 250, color: getRandomColor(), name: `Player ${id}` };

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    if (data.type === 'move') {
      clients[id].x += data.dx;
      clients[id].y += data.dy;
    } else if (data.type === 'name') {
      clients[id].name = data.name;
    }
    broadcast();
  });

  ws.on('close', () => {
    delete clients[id];
    broadcast();
  });

  broadcast();
});

function broadcast() {
  const state = JSON.stringify(clients);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(state);
    }
  });
}

app.use(express.static('public'));

server.listen(8080, () => {
  console.log('Listening on http://localhost:8080');
});
