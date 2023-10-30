import { Request, Response } from "express";
import Message from "../models/message.model";

export const getChatHistorial = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idFrom = req.body.idFrom;
        const idTo = req.body.idTo;
        if (!idFrom) return res.status(500).json({ message: 'Debe proporcionar un id de usuario emisor.' });
        if (!idTo) return res.status(500).json({ message: 'Debe proporcionar un id de usuario receptor.' });
        // const messages = await Message.find({ idGrupi: idGrupi }).populate('idGrupi') as any[];
        const messages = await Message.find({
            $or: [{ idFrom: idFrom, idTo: idTo }, { idFrom: idTo, idTo: idFrom }]
        })
            .sort({ createdAt: 'desc' });
        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const createMessage = async (payload: any) => {
    try {
        if (!payload.idFrom) return;
        if (!payload.idTo) return;
        console.log('CREATE MESSAGE PAYLOAD ::::::::::::::::: ', payload);
        const newMessage = new Message(payload);
        const message = await newMessage.save();
        console.log('CREATE MESSAGE MESSAGE SAVED ::::::::::::::::: ', message)
        return message;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default {
    createMessage,
    getChatHistorial,
}