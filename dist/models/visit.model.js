"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const visit_enum_1 = require("../constants/visit.enum");
const visitSchema = new mongoose_1.Schema({
    idGrupi: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    idPlace: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Place', required: true },
    visitStart: { type: Date, required: true, default: new Date() },
    visitEnd: { type: Date, required: false },
    status: { type: String, default: visit_enum_1.EVisitStatus.ACTIVE },
});
exports.default = (0, mongoose_1.model)('Visit', visitSchema);
