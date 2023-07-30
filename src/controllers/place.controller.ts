import { Request, Response } from "express";
import Place from "../models/place.model";

export const getPlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const place = await Place.findOne({ _id: req.params.id });
        return res.status(200).json(place);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getPlaces = async (req: Request, res: Response): Promise<Response> => {
    try {
        const places = await Place.find();
        return res.status(200).json(places);
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const createPlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newPlace = new Place(req.body);
        await newPlace.save();
        return res.status(200).json({ data: newPlace });
    } catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const updatePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const place = req.body;
        const placeUpdated = await Place.findOneAndUpdate({ _id: id }, place, { new: true });
        if (placeUpdated) return res.status(200).json(place);
        else return res.status(200).json({ message: 'No se encuentra el lugar.' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export const deletePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placename } = req.params;
        await Place.findOneAndDelete({ placename });
        return res.status(200).json({ response: 'Place deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}

export default {
    getPlace,
    getPlaces,
    createPlace,
    updatePlace,
    deletePlace,
}