import { model, Schema } from "mongoose";
import { IMessage } from "../interfaces/message.interface";

const messageSchema = new Schema({
    idFrom: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, required: false, default: Date.now },
}
    // , {
    //     timestamps: true
    // }
);

export default model<IMessage>('Message', messageSchema);