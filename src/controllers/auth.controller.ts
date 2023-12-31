import { Request, Response } from "express";
import User from "../models/user.model";
import jwt, { decode } from 'jsonwebtoken';
import config from '../config/config';
import { sendMail } from "../config/mail.config";
import { IUser } from "../interfaces/user.interface";
import { EUserStatus } from "../constants/user.enum";
import bcrypt from 'bcrypt';
import { EJwtError } from "../constants/auth.enum";

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ msg: 'Por favor envíe un correo y un password válidos.' });
        }
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe.' });
        }
        const newUser = new User(req.body);
        // newUser.code = generateCode();
        await newUser.save();
        // await sendMail(newUser.email, newUser.code.toString());
        return res.status(201).json({ newUser, token: createToken(newUser) });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al registrar al usuario.' });
    }
}

export const signIn = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Por favor, envíar usuario y contraseña.' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe.' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        return res.status(200).json({ token: createToken(user) });
    }
    return res.status(400).json({ msg: 'El correo o el password son incorrectos.' });
}

export const sendCode = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.body.email) {
            return res.status(400).json({ msg: 'Por favor, debe enviar su email' });
        }
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }
        const code = generateCode();
        const userUpdate = await User.findOneAndUpdate({ _id: user._id }, { code }, { new: true });
        if (userUpdate?.email) {
            await sendMail(userUpdate.email, userUpdate?.code.toString() as string);
            return res.status(200).json({ msg: 'Se ha enviado el código de verificación a su correo' });
        } else {
            return res.status(400).json({ msg: 'No se encontró un correo para este usuario.' });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al enviar el código' });
    }
}

export const confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.code) {
        return res.status(400).json({ msg: 'Por favor, Enviar el email y el código' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }

    const isMatch = user.code.toString() === req.body.code;
    if (isMatch) {
        await User.findOneAndUpdate({ _id: user.id }, { status: EUserStatus.VERIFIED, code: '' }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    return res.status(400).json({ msg: 'El código es incorrecto' });
}

function generateCode(): string {
    const min = 100000;
    const max = 999999;
    const rNum = Math.floor(Math.random() * (max - min + 1) + min);
    const code = rNum.toString();
    return code;
}

function createToken(user: IUser) {
    return jwt.sign({ id: user.id, email: user.email, status: user.status }, config.jwtSecret, {
        expiresIn: 86400
    });
}


export const recoverPassword = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.body.email || !req.body.newPassword) {
            return res.status(400).json({ msg: 'Por favor, envíar datos completos.' });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe.' });
        }

        const isMatch = await user.comparePassword(req.body.newPassword);
        if (!isMatch) {
            user.password = req.body.newPassword;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
            const userUpdated = await User.findOneAndUpdate({ _id: user._id }, user, { new: true });
            if (userUpdated) return res.status(200).json({ confirm: true });
        }
        return res.status(400).json({ msg: 'Debe ingresar una contraseña diferente a la anterior.' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al actualizar contraseña.' });
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
    try {
        const authToken = req.headers['authorization'];
        console.log('TOKEN ::::::::::::::', authToken);
        if (!authToken) {
            return res.status(400).json({ msg: 'Solicitud no permitida' });
        }
        const token = authToken.replace('Bearer ', '');
        let idUser = '';
        jwt.verify(token, config.jwtSecret, function (err: any, decoded: any) {
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
        const user = await User.findOne({ _id: idUser });
        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe.' });
        }
        return res.status(200).json({ token: createToken(user) });
    } catch (error) {
        console.log('ERROR ::::::::::::', error);
        return res.status(400).json({ msg: 'No es posible validar en este momento.' });
    }
}


export default {
    signUp,
    signIn,
    confirmEmail,
    sendCode,
    recoverPassword,
    refreshToken,
}
