import { Request, Response } from "express";
import User from "../models/user.model";
import { EUserStatus } from "../constants/user.enum";

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.profile) {
        return res.status(400).json({ msg: 'No se enviaron datos del perfil.' });
    }

    const user = await User.findOne({ _id: req.body.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        await User.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile, status: EUserStatus.PENDING }, { new: true });
        // await User.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'The code is incorrect' });
    }
}

export const updateConfirmPermissions = async (req: Request, res: Response): Promise<Response> => {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
        return res.status(400).json({ msg: 'El usuario no existe' });
    }
    try {
        await User.findOneAndUpdate({ _id: user.id }, { status: EUserStatus.ACTIVE }, { new: true });
        // await User.findOneAndUpdate({ _id: user.id }, { profile: req.body.profile }, { new: true });
        return res.status(200).json({ confirm: true });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Error al actualizar la confirmación de permisos' });
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

export default {
    updateProfile,
    updatePlaces,
    getUser,
    getUsers,
    updateImage,
    updateConfirmPermissions,
}