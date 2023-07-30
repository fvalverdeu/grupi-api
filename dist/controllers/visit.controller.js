"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVisit = exports.updateVisit = exports.createVisit = exports.getVisits = exports.getVisit = void 0;
const visit_model_1 = __importDefault(require("../models/visit.model"));
const getVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visit = yield visit_model_1.default.findOne({ _id: req.params.id });
        return res.status(200).json(visit);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getVisit = getVisit;
const getVisits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visits = yield visit_model_1.default.find();
        return res.status(200).json(visits);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getVisits = getVisits;
const createVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newVisit = new visit_model_1.default(req.body);
        yield newVisit.save();
        return res.status(200).json({ data: newVisit });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.createVisit = createVisit;
const updateVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const visit = req.body;
        const visitUpdated = yield visit_model_1.default.findOneAndUpdate({ _id: id }, visit, { new: true });
        if (visitUpdated)
            return res.status(200).json(visit);
        else
            return res.status(200).json({ message: 'No se encuentra el elemento.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.updateVisit = updateVisit;
const deleteVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { visitname } = req.params;
        yield visit_model_1.default.findOneAndDelete({ visitname });
        return res.status(200).json({ response: 'Visit deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.deleteVisit = deleteVisit;
exports.default = {
    getVisit: exports.getVisit,
    getVisits: exports.getVisits,
    createVisit: exports.createVisit,
    updateVisit: exports.updateVisit,
    deleteVisit: exports.deleteVisit,
};
