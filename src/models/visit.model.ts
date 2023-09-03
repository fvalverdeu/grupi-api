import { model, Schema } from "mongoose";
import { IVisit } from "../interfaces/visit.interface";
import { EVisitStatus } from "../constants/visit.enum";

const visitSchema = new Schema({
    idGrupi: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    idPlace: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
    visitStart: { type: Date, required: true, default: new Date() },
    visitEnd: { type: Date, required: false },
    status: { type: String, default: EVisitStatus.ACTIVE },
});

export default model<IVisit>('Visit', visitSchema);