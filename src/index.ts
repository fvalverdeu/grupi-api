import app from "./app";
import config from "./config/config";
import "./database";
import jwt, { decode } from 'jsonwebtoken';
import Controller from "./controllers/message.controller";

// Socket Server
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Socket messages
io.on('connection', (client: any) => {
    console.log('Cliente conectado');
    console.log(client.handshake.headers['auth-token']);
    const token = client.handshake.headers['auth-token'];
    if (!token) { return client.disconnect(); }
    const data = jwt.verify(token, config.jwtSecret);
    const payload = JSON.parse(JSON.stringify(data));
    console.log('SOCKET USER', payload);

    client.join(payload.id);

    client.on('personal-message', async (payload: any) => {
        console.log(payload);
        const message = await Controller.createMessage(payload);
        io.to(payload.to).emit('personal-message', message);
    })

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