"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const placeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true, default: '' },
    coords: { latitude: { type: String }, longitude: { type: String } },
    tags: [{ type: String }],
    brandUrl: { type: String, required: true, default: '' },
    backgroundUrl: { type: String, required: true, default: '' },
    bannerUrls: [{ type: String }],
    markerUrl: { type: String },
});
exports.default = (0, mongoose_1.model)('Place', placeSchema);
