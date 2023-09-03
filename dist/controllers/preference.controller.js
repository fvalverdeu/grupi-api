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
exports.deletePreference = exports.updatePreference = exports.createPreference = exports.getPreferences = exports.getPreference = void 0;
const preference_model_1 = __importDefault(require("../models/preference.model"));
const getPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const preference = yield preference_model_1.default.findOne({ _id: req.params.id }).populate('preferences', 'label _id');
        return res.status(200).json(preference);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getPreference = getPreference;
const getPreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const preferences = yield preference_model_1.default.find();
        return res.status(200).json(preferences);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getPreferences = getPreferences;
const createPreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPreference = new preference_model_1.default(req.body);
        yield newPreference.save();
        return res.status(200).json({ data: newPreference });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Error en servidor + ${error}` });
    }
});
exports.createPreference = createPreference;
const updatePreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { preferenceId } = req.params;
        const preference = req.body.preference;
        const preferenceUpdated = yield preference_model_1.default.findOneAndUpdate({ _id: preferenceId }, preference, { new: true });
        if (preferenceUpdated)
            return res.status(200).json(preference);
        else
            return res.status(200).json({ message: 'No se encuentra la preferencia.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.updatePreference = updatePreference;
const deletePreference = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { preferencename } = req.params;
        yield preference_model_1.default.findOneAndDelete({ preferencename });
        return res.status(200).json({ response: 'Preference deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.deletePreference = deletePreference;
exports.default = {
    getPreference: exports.getPreference,
    getPreferences: exports.getPreferences,
    createPreference: exports.createPreference,
    updatePreference: exports.updatePreference,
    deletePreference: exports.deletePreference,
};
