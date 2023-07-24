"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const preferenceSchema = new mongoose_1.Schema({
    label: { type: String, required: true, trim: true },
});
exports.default = (0, mongoose_1.model)('Preference', preferenceSchema);
