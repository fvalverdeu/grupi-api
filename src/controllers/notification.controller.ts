import { Request, Response } from "express";
import Notification from "../models/notification.model";

export const getNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = req.params.id;
        if (!id) return res.status(500).json({ message: 'Debe proporcionar un id de notificación.' });
        const notification = await Notification.findOne({ _id: req.params.id });
        return res.status(200).json(notification);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getNotifications = async (req: Request, res: Response): Promise<Response> => {
    try {
        const notifications = await Notification.find();
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getNotificationsByUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idGrupi = req.params.idGrupi;
        if (!idGrupi) return res.status(500).json({ message: 'Debe proporcionar un id de usuario.' });
        const notifications = await Notification.find({ idGrupi: idGrupi }).populate('idGrupi') as any[];
        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const createNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        return res.status(200).json({ data: newNotification });
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const updateNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const notification = req.body;
        const notificationUpdated = await Notification.findOneAndUpdate({ _id: id }, notification, { new: true });
        if (notificationUpdated) return res.status(200).json(notification);
        else return res.status(200).json({ message: 'No se encuentra el elemento.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const deleteNotification = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { notificationname } = req.params;
        await Notification.findOneAndDelete({ notificationname });
        return res.status(200).json({ response: 'Notification deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export default {
    getNotification,
    getNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    getNotificationsByUser,
}