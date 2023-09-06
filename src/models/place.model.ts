import { model, Schema } from "mongoose";
import { IPlace, ICoordinate } from "../interfaces/place.interface";

const placeSchema = new Schema({
    name: { type: String, unique: true, required: true, trim: true },
    address: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    coords: { latitude: { type: String }, longitude: { type: String } },
    tags: [{ type: String }],
    brandUrl: { type: String, required: true, default: '' },
    backgroundUrl: { type: String, required: true, default: '' },
    bannerUrls: [{ type: String }],
    markerUrl: { type: String },
});

export default model<IPlace>('Place', placeSchema);