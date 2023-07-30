import { Request, Response } from "express";
import Visit from "../models/visit.model";

export const getVisit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const visit = await Visit.findOne({ _id: req.params.id });
        return res.status(200).json(visit);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getVisits = async (req: Request, res: Response): Promise<Response> => {
    try {
        const visits = await Visit.find();
        return res.status(200).json(visits);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const createVisit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newVisit = new Visit(req.body);
        await newVisit.save();
        return res.status(200).json({ data: newVisit });
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const updateVisit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const visit = req.body;
        const visitUpdated = await Visit.findOneAndUpdate({ _id: id }, visit, { new: true });
        if (visitUpdated) return res.status(200).json(visit);
        else return res.status(200).json({ message: 'No se encuentra el elemento.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const deleteVisit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { visitname } = req.params;
        await Visit.findOneAndDelete({ visitname });
        return res.status(200).json({ response: 'Visit deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export default {
    getVisit,
    getVisits,
    createVisit,
    updateVisit,
    deleteVisit,
}