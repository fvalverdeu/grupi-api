import { Request, Response } from "express";
import Visit from "../models/visit.model";
import User from "../models/user.model";
import Contact from "../models/contact.model";
import Place from "../models/place.model";
import { EContactStatus } from "../constants/contact.enum";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


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

export const getVisitsByPlaceId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const idPlace = req.params.id;
        const idUser = req.body.idUser;
        const searchTerm = req.query.status;
        const place = await Place.findOne({ _id: idPlace });
        if (!place) {
            return res.status(400).json({ msg: 'El lugar no existe' });
        }
        const visits = await Visit.find({ idPlace: req.params.id, status: searchTerm }).populate('idGrupi') as any[];
        const contacts = await Contact.find({ $or: [{ idSender: idUser, status: EContactStatus.ACCEPT }, { idReceptor: idUser, status: EContactStatus.ACCEPT }] });
        const list = visits.map(item => {
            const grupi = {
                id: item.idGrupi._id,
                profile: item.idGrupi.profile,
                places: item.idGrupi.places,
                isContact: contacts.some(contact => (contact.idSender == item.idGrupi._id || contact.idReceptor == item.idGrupi._id))
            }
            return grupi;
        })
        return res.status(200).json({ idPlace: place._id, brandUrl: place.brandUrl, nroGrupis: list.length, list });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const getVisitsStatisticsByPlaceId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await User.findOne({ _id: req.body.idUser });
        const visits: any = await Visit.find({ idPlace: req.params.id, status: 'ACTIVE' }).populate('idGrupi');
        let totalFemale = 0;
        let totalMale = 0;
        let totalNotBinary = 0;
        let totalPreferences = 0;
        let totalAge = 0;
        const data = {
            femalePercent: 0,
            malePercent: 0,
            notBinaryPercent: 0,
            preferencesPercent: 0,
            totalGrupies: 0,
            ageAverage: 0,
        }
        const currentDate = new Date();
        const listCommonPreferences: any[] = [];
        let profiles: any[] = visits.map((item: any) => item.idGrupi.profile);
        profiles.forEach(profile => {
            profile.gender === 0 ? ++totalFemale : (profile.gender === 1 ? ++totalMale : ++totalNotBinary);
            if (user) {
                user.profile.preferenceList.forEach(preference => {
                    if (profile.preferenceList.includes(preference)) {
                        ++totalPreferences;
                        if (!listCommonPreferences.includes(preference)) listCommonPreferences.push(preference);
                    }
                });
            }
            var diff_ms = Date.now() - profile.birthdate.getTime();
            var age_dt = new Date(diff_ms);
            totalAge = totalAge + Math.abs(age_dt.getUTCFullYear() - currentDate.getFullYear());
        });
        const totalGrupiesData = profiles.length;
        const femalePercentData = Math.round((totalFemale / profiles.length) * 100);
        const malePercentData = Math.round((totalMale / profiles.length) * 100);
        const notBinaryPercentData = Math.round((totalNotBinary / profiles.length) * 100);
        const preferencesPercentData = user != null ? Math.round((listCommonPreferences.length / totalPreferences) * 100) : 0;
        const ageAverageData = Math.round((totalAge / profiles.length));

        data.totalGrupies = totalGrupiesData ? totalGrupiesData : 0;
        data.femalePercent = femalePercentData ? femalePercentData : 0;
        data.malePercent = malePercentData ? malePercentData : 0;
        data.notBinaryPercent = notBinaryPercentData ? notBinaryPercentData : 0;
        data.preferencesPercent = preferencesPercentData ? preferencesPercentData : 0;
        data.ageAverage = ageAverageData ? ageAverageData : 0;
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
}

export const createVisit = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { idGrupi, idPlace } = req.body;
        const user = await User.findOne({ _id: idGrupi });
        if (!user) return res.status(400).json({ msg: 'El usuario no existe' });
        const place = await Place.findOne({ _id: idPlace });
        if (!place) return res.status(400).json({ msg: 'El lugar no existe' });

        const newVisit = new Visit(req.body);
        // await newVisit.save();
        // const totalVisits = await Visit.collection.countDocuments({ idGrupi: idGrupi, idPlace: idPlace });
        // console.log('idGrupi: ' + idGrupi + ' idPlace: ' + idPlace)
        const totalVisits = await Visit.find({ idGrupi: idGrupi, idPlace: idPlace });
        console.log('NUMBER VISITS :::::::::::::::::::: ', totalVisits.length);
        if (totalVisits.length > 3) {
            console.log(user.places);
            const index = user.places.findIndex((placeItem: any) => placeItem._id.toString() === place._id.toString());
            console.log('indice', index)
            if (index === -1) {
                const placesUpdate = [...user.places];
                placesUpdate.push(place);
                console.log(user);
                // await user.save();
                await User.findOneAndUpdate({ _id: idGrupi }, { places: placesUpdate });
            }
        }
        return res.status(200).json({ data: newVisit });
    } catch (error) {
        console.log(error);
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
    getVisitsByPlaceId,
    getVisitsStatisticsByPlaceId,
}