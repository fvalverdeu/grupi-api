import { model, Schema } from "mongoose";
import { IVisit } from "../interfaces/visit.interface";

const visitSchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idPlace: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    visitStart: { type: Date, required: false },
    visitEnd: { type: Date, required: false },
    status: { type: String },
});

export default model<IVisit>('Visit', visitSchema);