import { model, Schema } from "mongoose";
import { IPreference } from "../interfaces/preference.interface";

const preferenceSchema = new Schema({
    label: { type: String, required: true, trim: true },
});

export default model<IPreference>('Preference', preferenceSchema);