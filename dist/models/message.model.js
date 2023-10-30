"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    idFrom: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    idTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, required: false, default: Date.now },
}
// , {
//     timestamps: true
// }
);
exports.default = (0, mongoose_1.model)('Message', messageSchema);
