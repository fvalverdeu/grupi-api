"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    jwtSecret: process.env.JWT_SECRET || 'somesecrettoken',
    DB: {
        // URI: process.env.MONGO_URL || 'mongodb://localhost/grupi',
        URI: 'mongodb://mongo:Wgq4ZHL1C6A0BxmXZ50s@containers-us-west-21.railway.app:7967',
        USER: process.env.MONGOUSER,
        PASSWORD: process.env.MONGOPASSWORD
    }
};
