"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config/config"));
require("./database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Socket Server
const server = require('http').createServer(app_1.default);
const io = require('socket.io')(server);
// Socket messages
io.on('connection', (client) => {
    console.log('Cliente conectado');
    console.log(client.handshake.headers['auth-token']);
    const token = client.handshake.headers['auth-token'];
    if (!token) {
        return client.disconnect();
    }
    const data = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
    const payload = JSON.parse(JSON.stringify(data));
    console.log('SOCKET USER', payload);
    client.join(payload.id);
    client.on('personal-message', (payload) => {
        console.log(payload);
        io.to(payload.to).emit('personal-message', payload);
    });
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    client.on('mensaje', (payload) => {
        console.log('Mensaje!!', payload);
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });
});
server.listen(app_1.default.get('port'));
console.log('Server on port', app_1.default.get('port'));
