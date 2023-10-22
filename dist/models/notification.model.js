"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notification_1 = require("../constants/notification");
const notificationSchema = new mongoose_1.Schema({
    idGrupi: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: false, default: Date.now },
    status: { type: String, default: notification_1.ENotificationStatus.ACTIVE },
});
exports.default = (0, mongoose_1.model)('Notification', notificationSchema);
