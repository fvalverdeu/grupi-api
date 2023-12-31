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
exports.refreshToken = exports.recoverPassword = exports.confirmEmail = exports.sendCode = exports.signIn = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const mail_config_1 = require("../config/mail.config");
const user_enum_1 = require("../constants/user.enum");
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ msg: 'Por favor envíe un correo y un password válidos.' });
        }
        const user = yield user_model_1.default.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe.' });
        }
        const newUser = new user_model_1.default(req.body);
        // newUser.code = generateCode();
        yield newUser.save();
        // await sendMail(newUser.email, newUser.code.toString());
        return res.status(201).json({ newUser, token: createToken(newUser) });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al registrar al usuario.' });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Por favor, envíar usuario y contraseña.' });
    }
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe.' });
    }
    const isMatch = yield user.comparePassword(req.body.password);
    if (isMatch) {
        return res.status(200).json({ token: createToken(user) });
    }
    return res.status(400).json({ msg: 'El correo o el password son incorrectos.' });
});
exports.signIn = signIn;
const sendCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email) {
            return res.status(400).json({ msg: 'Por favor, debe enviar su email' });
        }
        const { email } = req.body;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }
        const code = generateCode();
        const userUpdate = yield user_model_1.default.findOneAndUpdate({ _id: user._id }, { code }, { new: true });
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
const confirmEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.code) {
        return res.status(400).json({ msg: 'Por favor, Enviar el email y el código' });
    }
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    const isMatch = user.code.toString() === req.body.code;
    if (isMatch) {
        yield user_model_1.default.findOneAndUpdate({ _id: user.id }, { status: user_enum_1.EUserStatus.VERIFIED, code: '' }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    return res.status(400).json({ msg: 'El código es incorrecto' });
});
exports.confirmEmail = confirmEmail;
function generateCode() {
    const min = 100000;
    const max = 999999;
    const rNum = Math.floor(Math.random() * (max - min + 1) + min);
    const code = rNum.toString();
    return code;
}
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, status: user.status }, config_1.default.jwtSecret, {
        expiresIn: 86400
    });
}
const recoverPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.email || !req.body.newPassword) {
            return res.status(400).json({ msg: 'Por favor, envíar datos completos.' });
        }
        const user = yield user_model_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe.' });
        }
        const isMatch = yield user.comparePassword(req.body.newPassword);
        if (!isMatch) {
            user.password = req.body.newPassword;
            const salt = yield bcrypt_1.default.genSalt(10);
            const hash = yield bcrypt_1.default.hash(user.password, salt);
            user.password = hash;
            const userUpdated = yield user_model_1.default.findOneAndUpdate({ _id: user._id }, user, { new: true });
            if (userUpdated)
                return res.status(200).json({ confirm: true });
        }
        return res.status(400).json({ msg: 'Debe ingresar una contraseña diferente a la anterior.' });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al actualizar contraseña.' });
    }
});
exports.recoverPassword = recoverPassword;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authToken = req.headers['authorization'];
        console.log('TOKEN ::::::::::::::', authToken);
        if (!authToken) {
            return res.status(400).json({ msg: 'Solicitud no permitida' });
        }
        const token = authToken.replace('Bearer ', '');
        let idUser = '';
        jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret, function (err, decoded) {
            if (err) {
                console.log('VERIFY ERROR :::::::::::::::', err.name);
                // return res.status(400).json({ msg: 'Debe iniciar sesión nuevamente.' });
            }
            if (decoded) {
                console.log('DECODED :::::::::::: ', decoded);
                idUser = decoded.id;
            }
        });
        if (idUser.length === 0) {
            return res.status(400).json({ msg: 'Debe iniciar sesión nuevamente.' });
        }
        const user = yield user_model_1.default.findOne({ _id: idUser });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe.' });
        }
        return res.status(200).json({ token: createToken(user) });
    }
    catch (error) {
        console.log('ERROR ::::::::::::', error);
        return res.status(400).json({ msg: 'No es posible validar en este momento.' });
    }
});
exports.refreshToken = refreshToken;
exports.default = {
    signUp: exports.signUp,
    signIn: exports.signIn,
    confirmEmail: exports.confirmEmail,
    sendCode: exports.sendCode,
    recoverPassword: exports.recoverPassword,
    refreshToken: exports.refreshToken,
};
