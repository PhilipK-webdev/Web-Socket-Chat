const PORT = 8000;
// store all the connected clients
const clients = {};
const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer();
server.listen(PORT);
console.log('Listening on port 8000');

const wsServer = new webSocketServer({
    httpServer: server
});

const getUniqueId = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}
wsServer.on('request', (request) => {
    const userId = getUniqueId();
    console.log((new Date()) + 'recieved a new connection from origin' + request.origin + '.');

    const connection = request.accept(null, request.origin);
    clients[userId] = connection;
    console.log('connected: ' + userId + ' in ' + Object.getOwnPropertyNames(clients));
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);

            // broadcasting message to all connected clients
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('sent Message to: ', clients[key]);
            }
        }
    })
})

