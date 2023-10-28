"use strict";
const { io } = require('../index');
// Socket messages
io.on("connection", (client) => {
    console.log("Cliente conectado");
    client.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
    client.on("mensaje", (payload) => {
        console.log("Mensaje!!", payload);
        io.emit("mensaje", { admin: "Nuevo mensaje" });
    });
});
