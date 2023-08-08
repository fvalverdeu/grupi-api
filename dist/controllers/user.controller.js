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
exports.updateImage = exports.getUsers = exports.getUser = exports.updatePlaces = exports.updateProfile = exports.confirmEmail = exports.signIn = exports.sendCode = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const mail_config_1 = require("../config/mail.config");
const user_enum_1 = require("../constants/user.enum");
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, status: user.status }, config_1.default.jwtSecret, {
        expiresIn: 86400
    });
}
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Please. Send your email and password' });
    }
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ msg: 'The user already exists' });
    }
    const newUser = new user_model_1.default(req.body);
    newUser.code = generateCode();
    yield newUser.save();
    yield (0, mail_config_1.sendMail)(newUser.email, newUser.code.toString());
    return res.status(201).json(newUser);
});
exports.signUp = signUp;
const sendCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ msg: 'Please. Send your userId' });
        }
        const { userId } = req.body;
        const user = yield user_model_1.default.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ msg: 'The user not exists' });
        }
        const code = generateCode();
        const userUpdate = yield user_model_1.default.findOneAndUpdate({ _id: userId }, { code }, { new: true });
        if (userUpdate === null || userUpdate === void 0 ? void 0 : userUpdate.email) {
            yield (0, mail_config_1.sendMail)(userUpdate.email, userUpdate === null || userUpdate === void 0 ? void 0 : userUpdate.code.toString());
            return res.status(200).json({ msg: 'Se ha enviado el código de verificación a su correo' });
        }
        else {
            return res.status(400).json({ msg: 'No se encontró un correo para este usuario.' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al enviar el código' });
    }
});
exports.sendCode = sendCode;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Please. Send your email and password' });
    }
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'The user does not exists' });
    }
    const isMatch = yield user.comparePassword(req.body.password);
    if (isMatch) {
        return res.status(200).json({ token: createToken(user) });
    }
    return res.status(400).json({ msg: 'The email or password are incorrect' });
});
exports.signIn = signIn;
const confirmEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.code) {
        return res.status(400).json({ msg: 'Please. Send your email and code' });
    }
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'The user does not exists' });
    }
    const isMatch = user.code.toString() === req.body.code;
    if (isMatch) {
        yield user_model_1.default.findOneAndUpdate({ _id: user.id }, { status: user_enum_1.EUserStatus.VERIFIED }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    return res.status(400).json({ msg: 'The code is incorrect' });
});
exports.confirmEmail = confirmEmail;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.profile) {
        return res.status(400).json({ msg: 'No se enviaron datos del perfil.' });
    }
    const user = yield user_model_1.default.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        // await User.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile, status: EUserStatus.ACTIVE }, { new: true });
        yield user_model_1.default.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'The code is incorrect' });
    }
});
exports.updateProfile = updateProfile;
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
function generateCode() {
    const min = 100000;
    const max = 999999;
    const rNum = Math.floor(Math.random() * (max - min + 1) + min);
    const code = rNum.toString();
    return code;
}
exports.default = {
    signUp: exports.signUp,
    signIn: exports.signIn,
    confirmEmail: exports.confirmEmail,
    updateProfile: exports.updateProfile,
    updatePlaces: exports.updatePlaces,
    getUser: exports.getUser,
    getUsers: exports.getUsers,
    sendCode: exports.sendCode,
    updateImage: exports.updateImage,
};
