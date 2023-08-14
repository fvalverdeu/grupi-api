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
exports.updateImage = exports.getUsers = exports.getUser = exports.updatePlaces = exports.updateConfirmPermissions = exports.updateProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const user_enum_1 = require("../constants/user.enum");
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.profile) {
        return res.status(400).json({ msg: 'No se enviaron datos del perfil.' });
    }
    const user = yield user_model_1.default.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        yield user_model_1.default.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile, status: user_enum_1.EUserStatus.PENDING }, { new: true });
        // await User.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'The code is incorrect' });
    }
});
exports.updateProfile = updateProfile;
const updateConfirmPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        yield user_model_1.default.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile, status: user_enum_1.EUserStatus.ACTIVE }, { new: true });
        // await User.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al actualizar la confirmación de permisos' });
    }
});
exports.updateConfirmPermissions = updateConfirmPermissions;
const updatePlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.places) {
        return res.status(400).json({ msg: 'No se enviaron datos de los lugares.' });
    }
    const user = yield user_model_1.default.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        yield user_model_1.default.findOneAndUpdate({ _id: user.id }, { places: req.body.places }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    catch (error) {
        return res.status(400).json({ msg: 'Error al actualizar lugares' });
    }
});
exports.updatePlaces = updatePlaces;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ _id: req.params.id });
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getUser = getUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getUsers = getUsers;
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('REQUEST IN CONTROLLER: ' + req);
    const _id = req.params.id;
    if (!_id) {
        console.log('ERROR: No se enviaron datos del usuario', req);
        return res.status(400).json({ msg: 'No se enviaron datos del usuario.' });
    }
    const user = yield user_model_1.default.findOne({ _id: req.params.id });
    if (!user) {
        console.log('El usuario no existe');
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        console.log('FILE ' + req);
        user.profile.imageUrl = `users/${_id}/image.png`;
        yield user_model_1.default.findOneAndUpdate({ _id: user.id }, { profile: user.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    catch (error) {
        console.log('ERROR: Error al actualizar datos del usuario.' + error);
        return res.status(400).json({ msg: 'Error al actualizar datos del usuario.' });
    }
});
exports.updateImage = updateImage;
exports.default = {
    updateProfile: exports.updateProfile,
    updatePlaces: exports.updatePlaces,
    getUser: exports.getUser,
    getUsers: exports.getUsers,
    updateImage: exports.updateImage,
    updateConfirmPermissions: exports.updateConfirmPermissions,
};
