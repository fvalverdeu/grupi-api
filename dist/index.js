"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
require("./database");
// Socket Server
const server = require('http').createServer(app_1.default);
const io = require('socket.io')(server);
// Socket messages
io.on('connection', (client) => {
    console.log('Cliente conectado');
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
