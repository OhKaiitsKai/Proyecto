const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let players = {};
let playerCount = 0;

wss.on('connection', (socket) => {
    let playerId = null;

    console.log('New connection established');

    socket.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'join') {
            playerId = data.id;
            players[playerId] = { socket };
            playerCount++;
            console.log(`Player ${playerId} joined. Player count: ${playerCount}`);
            broadcast({ type: 'playerJoined', id: playerId });

            if (playerCount >= 2) {
                console.log('Starting game');
                broadcast({ type: 'startGame' });
            }

        } else if (data.type === 'move') {
            players[playerId].position = data.position;
            players[playerId].rotation = data.rotation;

            broadcast({
                type: 'opponentMove',
                id: playerId,
                position: data.position,
                rotation: data.rotation
            }, playerId);

        }
    });

    socket.on('close', () => {
        if (playerId !== null) {
            delete players[playerId];
            playerCount--;
            console.log(`Player ${playerId} left. Player count: ${playerCount}`);
            broadcast({ type: 'playerLeft', id: playerId });
        }
    });
});

const broadcast = (data, excludeId) => {
    const message = JSON.stringify(data);
    Object.keys(players).forEach((id) => {
        if (id !== excludeId) {
            players[id].socket.send(message);
        }
    });
};

console.log('WebSocket server running');

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
