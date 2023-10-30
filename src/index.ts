import app from "./app";
import config from "./config/config";
import "./database";
import jwt, { decode } from 'jsonwebtoken';

// Socket Server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Socket messages
io.on('connection', (client: any) => {
    console.log('Cliente conectado');
    console.log(client.handshake.headers['auth-token']);
    const token = client.handshake.headers['auth-token'];
    if (!token) { return client.disconnect(); }
    const id = jwt.verify(token, config.jwtSecret);
    console.log('SOCKE ID USER', id);

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