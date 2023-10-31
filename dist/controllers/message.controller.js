"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = exports.getChatHistorial = void 0;
const message_model_1 = __importDefault(require("../models/message.model"));
const getChatHistorial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idFrom = req.body.idFrom;
        const idTo = req.body.idTo;
        if (!idFrom)
            return res.status(500).json({ message: 'Debe proporcionar un id de usuario emisor.' });
        if (!idTo)
            return res.status(500).json({ message: 'Debe proporcionar un id de usuario receptor.' });
        // const messages = await Message.find({ idGrupi: idGrupi }).populate('idGrupi') as any[];
        const messages = yield message_model_1.default.find({
            $or: [{ idFrom: idFrom, idTo: idTo }, { idFrom: idTo, idTo: idFrom }]
        });
        // .sort({ createdAt: 'desc' });
        return res.status(200).json(messages);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getChatHistorial = getChatHistorial;
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!payload.idFrom)
            return;
        if (!payload.idTo)
            return;
        const newMessage = new message_model_1.default(payload);
        const message = yield newMessage.save();
        return message;
    }
    catch (error) {
        console.log(error);
        return null;
    }
});
exports.createMessage = createMessage;
exports.default = {
    createMessage: exports.createMessage,
    getChatHistorial: exports.getChatHistorial,
};
