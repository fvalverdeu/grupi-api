"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
// router.get('/', authValidate, Controller.getMessage);
router.post('/historial', authValidate, message_controller_1.default.getChatHistorial);
// router.get('/:id', authValidate, Controller.getMessages);
// router.post('/', authValidate, Controller.createMessage);
// router.put('/:id', authValidate, Controller.updateMessage);
// router.delete('/:id', authValidate, Controller.deleteMessage);
exports.default = router;
