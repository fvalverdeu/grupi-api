"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    birthdate: { type: Date, required: true },
    gender: { type: Number, required: true },
    imageUrl: { type: String, required: true, trim: true },
    preferences: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Preference'
        }],
});
exports.default = (0, mongoose_1.model)('Profile', profileSchema);
