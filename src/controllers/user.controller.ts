import { Request, Response } from "express";
import User from "../models/user.model";
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { sendMail } from "../config/mail.config";
import { IUser } from "../interfaces/user.interface";
import { EUserStatus } from "../constants/user.enum";

function createToken(user: IUser) {
    return jwt.sign({ id: user.id, email: user.email, status: user.status }, config.jwtSecret, {
        expiresIn: 86400
    });
}

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Please. Send your email and password' });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ msg: 'The user already exists' });
    }
    const newUser = new User(req.body);
    newUser.code = generateCode();
    await newUser.save();
    await sendMail(newUser.email, newUser.code.toString());
    return res.status(201).json(newUser);
}

export const sendCode = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.body.userId) {
            return res.status(400).json({ msg: 'Please. Send your userId' });
        }
        const { userId } = req.body;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ msg: 'The user not exists' });
        }
        const code = generateCode();
        const userUpdate = await User.findOneAndUpdate({ _id: userId }, { code }, { new: true });
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

export const signIn = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ msg: 'Please. Send your email and password' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'The user does not exists' });
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        return res.status(200).json({ token: createToken(user) });
    }
    return res.status(400).json({ msg: 'The email or password are incorrect' });
}

export const confirmEmail = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.code) {
        return res.status(400).json({ msg: 'Please. Send your email and code' });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ msg: 'The user does not exists' });
    }

    const isMatch = user.code.toString() === req.body.code;
    if (isMatch) {
        await User.findOneAndUpdate({ _id: user.id }, { status: EUserStatus.VERIFIED }, { new: true });
        return res.status(200).json({ confirm: true });
    }
    return res.status(400).json({ msg: 'The code is incorrect' });
}

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.profile) {
        return res.status(400).json({ msg: 'No se enviaron datos del perfil.' });
    }

    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        await User.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    } catch (error) {
        return res.status(400).json({ msg: 'The code is incorrect' });
    }
}

export const updatePlaces = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.places) {
        return res.status(400).json({ msg: 'No se enviaron datos de los lugares.' });
    }

    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        await User.findOneAndUpdate({ _id: user.id }, { places: req.body.places }, { new: true });
        return res.status(200).json({ confirm: true });
    } catch (error) {
        return res.status(400).json({ msg: 'Error al actualizar lugares' });
    }
}

export const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const updateImage = async (req: Request, res: Response): Promise<Response> => {
    console.log('REQUEST IN CONTROLLER: ' + req);
    const _id = req.params.id;
    if (!_id) {
        console.log('ERROR: No se enviaron datos del usuario', req);
        return res.status(400).json({ msg: 'No se enviaron datos del usuario.' });
    }

    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        console.log('El usuario no existe');
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        console.log('FILE ' + req);
        user.profile.imageUrl = `users/${_id}/image.png`
        await User.findOneAndUpdate({ _id: user.id }, { profile: user.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    } catch (error) {
        console.log('ERROR: Error al actualizar datos del usuario.' + error);
        return res.status(400).json({ msg: 'Error al actualizar datos del usuario.' });
    }
}

function generateCode(): string {
    const min = 100000;
    const max = 999999;
    const rNum = Math.floor(Math.random() * (max - min + 1) + min);
    const code = rNum.toString();
    return code;
}

export default {
    signUp,
    signIn,
    confirmEmail,
    updateProfile,
    updatePlaces,
    getUser,
    getUsers,
    sendCode,
    updateImage,
}