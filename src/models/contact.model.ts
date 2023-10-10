import { model, Schema } from "mongoose";
import { IContact } from "../interfaces/contact.interface";
import { EContactStatus } from "../constants/contact.enum";

const contactSchema = new Schema({
    idSender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idReceptor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: false, default: Date.now },
    status: { type: String, default: EContactStatus.SEND },
});

export default model<IContact>('Contact', contactSchema);