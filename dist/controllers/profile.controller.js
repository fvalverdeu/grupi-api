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
exports.deleteProfile = exports.updateProfile = exports.createProfile = exports.getProfiles = exports.getProfile = void 0;
const profile_model_1 = __importDefault(require("../models/profile.model"));
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profile = yield profile_model_1.default.findOne({ _id: req.params.id }).populate('preferences', 'label _id');
        return res.status(200).json(profile);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getProfile = getProfile;
const getProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield profile_model_1.default.find();
        return res.status(200).json(profiles);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getProfiles = getProfiles;
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProfile = new profile_model_1.default(req.body);
        yield newProfile.save();
        return res.status(200).json({ data: newProfile });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.createProfile = createProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileId } = req.params;
        const profile = req.body.profile;
        const profileUpdated = yield profile_model_1.default.findOneAndUpdate({ _id: profileId }, profile, { new: true });
        if (profileUpdated)
            return res.status(200).json(profile);
        else
            return res.status(200).json({ message: 'No se encuentra el perfil.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.updateProfile = updateProfile;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profilename } = req.params;
        yield profile_model_1.default.findOneAndDelete({ profilename });
        return res.status(200).json({ response: 'Profile deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.deleteProfile = deleteProfile;
exports.default = {
    getProfile: exports.getProfile,
    getProfiles: exports.getProfiles,
    createProfile: exports.createProfile,
    updateProfile: exports.updateProfile,
    deleteProfile: exports.deleteProfile,
};
