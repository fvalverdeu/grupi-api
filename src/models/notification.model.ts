import { model, Schema } from "mongoose";
import { INotification } from "../interfaces/notification.interface";
import { ENotificationStatus } from "../constants/notification";

const notificationSchema = new Schema({
    idGrupi: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, required: false, default: Date.now },
    status: { type: String, default: ENotificationStatus.ACTIVE },
});

export default model<INotification>('Notification', notificationSchema);