import app from "./app";
import "./database";

// Socket Server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Socket messages
io.on('connection', (client: any) => {
    console.log('Cliente conectado');

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    })

    client.on('mensaje', (payload: any) => {
        console.log('Mensaje!!', payload);

        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    })
});

server.listen(app.get('port'));
console.log('Server on port', app.get('port'));