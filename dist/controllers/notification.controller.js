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
exports.deleteNotification = exports.updateNotification = exports.createNotification = exports.getNotificationsByUser = exports.getNotifications = exports.getNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const getNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            return res.status(500).json({ message: 'Debe proporcionar un id de notificación.' });
        const notification = yield notification_model_1.default.findOne({ _id: req.params.id });
        return res.status(200).json(notification);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getNotification = getNotification;
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_model_1.default.find();
        return res.status(200).json(notifications);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getNotifications = getNotifications;
const getNotificationsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idGrupi = req.params.idGrupi;
        if (!idGrupi)
            return res.status(500).json({ message: 'Debe proporcionar un id de usuario.' });
        // const notifications = await Notification.find({ idGrupi: idGrupi }).populate('idGrupi') as any[];
        const notifications = yield notification_model_1.default.find({ idGrupi: idGrupi });
        return res.status(200).json(notifications);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getNotificationsByUser = getNotificationsByUser;
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newNotification = new notification_model_1.default(req.body);
        yield newNotification.save();
        return res.status(200).json({ data: newNotification });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.createNotification = createNotification;
const updateNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const notification = req.body;
        const notificationUpdated = yield notification_model_1.default.findOneAndUpdate({ _id: id }, notification, { new: true });
        if (notificationUpdated)
            return res.status(200).json(notification);
        else
            return res.status(200).json({ message: 'No se encuentra el elemento.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.updateNotification = updateNotification;
const deleteNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notificationname } = req.params;
        yield notification_model_1.default.findOneAndDelete({ notificationname });
        return res.status(200).json({ response: 'Notification deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.deleteNotification = deleteNotification;
exports.default = {
    getNotification: exports.getNotification,
    getNotifications: exports.getNotifications,
    createNotification: exports.createNotification,
    updateNotification: exports.updateNotification,
    deleteNotification: exports.deleteNotification,
    getNotificationsByUser: exports.getNotificationsByUser,
};
