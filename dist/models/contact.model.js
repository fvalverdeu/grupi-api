"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contact_enum_1 = require("../constants/contact.enum");
const contactSchema = new mongoose_1.Schema({
    idSender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    idReceptor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: false, default: Date.now },
    status: { type: String, default: contact_enum_1.EContactStatus.SEND },
});
exports.default = (0, mongoose_1.model)('Contact', contactSchema);
