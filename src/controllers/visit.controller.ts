import { Request, Response } from "express";
import Visit from "../models/visit.model";
import User from "../models/user.model";
import { IProfile } from "../interfaces/user.interface";

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
        data.totalGrupies = profiles.length;
        data.femalePercent = Math.round((totalFemale / profiles.length) * 100);
        data.malePercent = Math.round((totalMale / profiles.length) * 100);
        data.notBinaryPercent = Math.round((totalNotBinary / profiles.length) * 100);
        data.preferencesPercent = user != null ? Math.round((listCommonPreferences.length / totalPreferences) * 100) : 0;
        data.ageAverage = Math.round((totalAge / profiles.length) * 100);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
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
    getVisitsByPlaceId,
}