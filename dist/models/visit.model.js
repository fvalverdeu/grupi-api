"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const visitSchema = new mongoose_1.Schema({
    idUser: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    idPlace: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Place', required: true },
    visitStart: { type: Date, required: false },
    visitEnd: { type: Date, required: false },
    status: { type: String },
});
exports.default = (0, mongoose_1.model)('Visit', visitSchema);
