const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let players = {};

server.on('connection', (socket) => {
    let playerId = null;

    socket.on('message', (message) => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'join':
                playerId = data.id;
                players[playerId] = socket;
                console.log(`Player ${playerId} joined`);
                // Informar a otros jugadores sobre la nueva conexión
                for (const id in players) {
                    if (id !== playerId) {
                        players[id].send(JSON.stringify({ type: 'playerJoined', id: playerId }));
                    }
                }
                break;
            case 'move':
                // Reenviar los datos de movimiento al otro jugador
                for (const id in players) {
                    if (id !== playerId) {
                        players[id].send(JSON.stringify({
                            type: 'opponentMove',
                            position: data.position,
                            rotation: data.rotation
                        }));
                    }
                }
                break;
            // Agregar más casos según sea necesario
        }
    });

    socket.on('close', () => {
        console.log(`Player ${playerId} disconnected`);
        delete players[playerId];
        // Informar a otros jugadores sobre la desconexión
        for (const id in players) {
            players[id].send(JSON.stringify({ type: 'playerLeft', id: playerId }));
        }
    });
});

console.log('WebSocket server started on ws://localhost:8080');
