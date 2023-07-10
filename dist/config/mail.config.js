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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const mail = {
    user: 'upruebas112358@gmail.com',
    pass: 'tiahpycvsolxotrs'
};
const sendMail = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        secure: true,
        port: 465,
        auth: {
            user: mail.user,
            pass: mail.pass
        }
    });
    const imgData = fs_1.default.readFileSync('dist/assets/logo-email.png', { encoding: 'base64' });
    console.log('IMAGEN', imgData);
    yield transporter.sendMail({
        from: mail.user,
        to: email,
        subject: 'Verificación de cuenta',
        text: 'Verificación de cuenta para registro',
        attachments: [{
                filename: 'logo-email.png',
                path: 'dist/assets/logo-email.png',
                cid: 'logo'
            }],
        html: `
            <head>
                <style>
                    #email___content {
                        background-color: #FFFFFF;
                    }
                    h1, h2, p {
                        color: #6F6F6F;
                        text-align: center;
                    }
                </style>
            </head>
            
            <div id="email___content" style="text-align: center;">
                <img height="128" width="300" src="cid:logo"/>
                <h1>Hola ${email}</h1>
                <h2>Gracias por registrarte...</h2>
                <br>
                <p style="font-size: 1.45rem;">¡Falta poco para que seas parte de la comunidad Grupi!</p>
                <p style="font-size: 1.45rem;">Para confirmar tu cuenta, ingresa el siguiente <b>código</b> en Grupi.</p>
                <p style="font-weight: bold; font-size: 3.5rem; color: #000000">${code}</p>
                <br><br>
            </div>
        `
    });
});
exports.sendMail = sendMail;
