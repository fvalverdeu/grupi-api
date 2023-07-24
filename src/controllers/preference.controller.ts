import { Request, Response } from "express";
import Preference from "../models/preference.model";

export const getPreference = async (req: Request, res: Response): Promise<Response> => {
    try {
        const preference = await Preference.findOne({ _id: req.params.id }).populate('preferences', 'label _id');
        return res.status(200).json(preference);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getPreferences = async (req: Request, res: Response): Promise<Response> => {
    try {
        const preferences = await Preference.find();
        return res.status(200).json(preferences);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const createPreference = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newPreference = new Preference(req.body);
        await newPreference.save();
        return res.status(200).json({ data: newPreference });
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const updatePreference = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { preferenceId } = req.params;
        const preference = req.body.preference;
        const preferenceUpdated = await Preference.findOneAndUpdate({ _id: preferenceId }, preference, { new: true });
        if (preferenceUpdated) return res.status(200).json(preference);
        else return res.status(200).json({ message: 'No se encuentra la preferencia.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const deletePreference = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { preferencename } = req.params;
        await Preference.findOneAndDelete({ preferencename });
        return res.status(200).json({ response: 'Preference deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export default {
    getPreference,
    getPreferences,
    createPreference,
    updatePreference,
    deletePreference,
}