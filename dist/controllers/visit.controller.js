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
exports.checkIfVisitNow = exports.checkOut = exports.deleteVisit = exports.updateVisit = exports.createVisit = exports.getVisitsStatisticsByPlaceId = exports.getVisitsByPlaceId = exports.getVisits = exports.getVisit = void 0;
const visit_model_1 = __importDefault(require("../models/visit.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const place_model_1 = __importDefault(require("../models/place.model"));
const contact_enum_1 = require("../constants/contact.enum");
const mongoose_1 = __importDefault(require("mongoose"));
const visit_enum_1 = require("../constants/visit.enum");
const ObjectId = mongoose_1.default.Types.ObjectId;
const getVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visit = yield visit_model_1.default.findOne({ _id: req.params.id });
        return res.status(200).json(visit);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getVisit = getVisit;
const getVisits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const visits = yield visit_model_1.default.find();
        return res.status(200).json(visits);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getVisits = getVisits;
const getVisitsByPlaceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idPlace = req.params.id;
        const idUser = req.body.idUser;
        const searchTerm = req.query.status;
        console.log(idPlace);
        const place = yield place_model_1.default.findOne({ _id: idPlace });
        console.log(idUser);
        if (!place) {
            return res.status(400).json({ msg: 'El lugar no existe' });
        }
        // const visits = await Visit.find({ idPlace: req.params.id, status: searchTerm, idGrupi: { $ne: req.body.idUser } }).populate('idGrupi') as any[];
        console.log(place);
        const visits = yield visit_model_1.default.find({ idPlace: req.params.id, status: searchTerm }).populate('idGrupi');
        console.log(visits);
        const contacts = yield contact_model_1.default.find({ $or: [{ idSender: idUser, status: contact_enum_1.EContactStatus.ACCEPT }, { idReceptor: idUser, status: contact_enum_1.EContactStatus.ACCEPT }] });
        const list = visits.map(item => {
            const grupi = {
                id: item.idGrupi._id,
                profile: item.idGrupi.profile,
                places: item.idGrupi.places,
                isContact: contacts.some(contact => (contact.idSender == item.idGrupi._id || contact.idReceptor == item.idGrupi._id))
            };
            return grupi;
        });
        return res.status(200).json({ idPlace: place._id, brandUrl: place.brandUrl, nroGrupis: list.length, list });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getVisitsByPlaceId = getVisitsByPlaceId;
const getVisitsStatisticsByPlaceId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser } = req.body;
        const idPlace = req.params.id;
        console.log(idUser);
        const user = yield user_model_1.default.findOne({ _id: req.body.idUser });
        console.log(idPlace);
        if (!user)
            return res.status(400).json({ msg: 'El usuario no existe' });
        console.log('prev');
        const place = yield place_model_1.default.findOne({ _id: idPlace });
        console.log('after');
        if (!place) {
            return res.status(400).json({ msg: 'El lugar no existe' });
        }
        // const visits: any = await Visit.find({ idPlace: req.params.id, status: 'ACTIVE', idGrupi: { $ne: req.body.idUser } }).populate('idGrupi');
        console.log(user);
        const visits = yield visit_model_1.default.find({ idPlace: req.params.id, status: 'ACTIVE' }).populate('idGrupi');
        console.log(place);
        let totalFemale = 0;
        let totalMale = 0;
        let totalNotBinary = 0;
        let totalPreferences = 0;
        let totalProfessionalPreferences = 0;
        let totalAge = 0;
        const data = {
            femalePercent: 0,
            malePercent: 0,
            notBinaryPercent: 0,
            preferencesPercent: 0,
            professionalPercent: 0,
            totalGrupies: 0,
            ageAverage: 0,
        };
        const listCommonPreferences = [];
        const listCommonProfessionalPreferences = [];
        let profiles = visits.map((item) => item.idGrupi.profile);
        profiles.forEach(profile => {
            profile.gender === 0 ? ++totalFemale : (profile.gender === 1 ? ++totalMale : ++totalNotBinary);
            if (user) {
                user.profile.preferenceList.forEach(preference => {
                    if (profile.preferenceList.includes(preference)) {
                        ++totalPreferences;
                        if (!listCommonPreferences.includes(preference))
                            listCommonPreferences.push(preference);
                    }
                });
                user.profile.professionalList.forEach(preference => {
                    if (profile.professionalList.includes(preference)) {
                        ++totalProfessionalPreferences;
                        if (!listCommonProfessionalPreferences.includes(preference))
                            listCommonProfessionalPreferences.push(preference);
                    }
                });
            }
            var diff_ms = Date.now() - profile.birthdate.getTime();
            var age_dt = new Date(diff_ms);
            const ageUser = Math.abs(age_dt.getUTCFullYear() - 1970);
            totalAge = totalAge + Math.abs(ageUser);
        });
        const totalGrupiesData = profiles.length;
        const femalePercentData = Math.round((totalFemale / profiles.length) * 100);
        const malePercentData = Math.round((totalMale / profiles.length) * 100);
        const notBinaryPercentData = Math.round((totalNotBinary / profiles.length) * 100);
        // const preferencesPercentData = user != null ? Math.round((listCommonPreferences.length / totalPreferences) * 100) : 0;
        const preferencesPercentData = user != null ? Math.round((listCommonPreferences.length / user.profile.preferenceList.length) * 100) : 0;
        const professionalPreferencesPercentData = user != null ? Math.round((listCommonProfessionalPreferences.length / user.profile.professionalList.length) * 100) : 0;
        const ageAverageData = Math.round((totalAge / profiles.length));
        data.totalGrupies = totalGrupiesData ? totalGrupiesData : 0;
        data.femalePercent = femalePercentData ? femalePercentData : 0;
        data.malePercent = malePercentData ? malePercentData : 0;
        data.notBinaryPercent = notBinaryPercentData ? notBinaryPercentData : 0;
        data.preferencesPercent = preferencesPercentData ? preferencesPercentData : 0;
        data.professionalPercent = professionalPreferencesPercentData ? professionalPreferencesPercentData : 0;
        data.ageAverage = ageAverageData ? ageAverageData : 0;
        return res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getVisitsStatisticsByPlaceId = getVisitsStatisticsByPlaceId;
const createVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idGrupi, idPlace } = req.body;
        if (!idGrupi)
            return res.status(500).json({ message: 'Ingrese un ID Grupi' });
        if (!idPlace)
            return res.status(500).json({ message: 'Ingrese un ID Place' });
        const user = yield user_model_1.default.findOne({ _id: idGrupi });
        if (!user)
            return res.status(400).json({ msg: 'El usuario no existe' });
        const place = yield place_model_1.default.findOne({ _id: idPlace });
        if (!place)
            return res.status(400).json({ msg: 'El lugar no existe' });
        const activeVisits = yield visit_model_1.default.find({ idGrupi: idGrupi, idPlace: idPlace, status: visit_enum_1.EVisitStatus.ACTIVE });
        if (activeVisits.length > 0)
            return res.status(400).json({ msg: 'Usted ya está conectado en otro establecimiento.' });
        const newVisit = new visit_model_1.default(req.body);
        yield newVisit.save();
        // const totalVisits = await Visit.collection.countDocuments({ idGrupi: idGrupi, idPlace: idPlace });
        // console.log('idGrupi: ' + idGrupi + ' idPlace: ' + idPlace)
        const totalVisits = yield visit_model_1.default.find({ idGrupi: idGrupi, idPlace: idPlace });
        console.log('NUMBER VISITS :::::::::::::::::::: ', totalVisits.length);
        if (totalVisits.length > 3) {
            console.log(user.places);
            const index = user.places.findIndex((placeItem) => placeItem._id.toString() === place._id.toString());
            console.log('indice', index);
            if (index === -1) {
                const placesUpdate = [...user.places];
                placesUpdate.push(place);
                console.log(user);
                // await user.save();
                yield user_model_1.default.findOneAndUpdate({ _id: idGrupi }, { places: placesUpdate });
            }
        }
        const dataNewVisit = {
            _id: newVisit._id,
            idGrupi, idPlace,
            visitStart: newVisit.visitStart,
            status: newVisit.status,
            coords: place.coords,
        };
        return res.status(200).json(dataNewVisit);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.createVisit = createVisit;
const updateVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const visit = req.body;
        const visitUpdated = yield visit_model_1.default.findOneAndUpdate({ _id: id }, visit, { new: true });
        if (visitUpdated)
            return res.status(200).json(visitUpdated);
        else
            return res.status(200).json({ message: 'No se encuentra el elemento.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.updateVisit = updateVisit;
const deleteVisit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { visitname } = req.params;
        yield visit_model_1.default.findOneAndDelete({ visitname });
        return res.status(200).json({ response: 'Visit deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.deleteVisit = deleteVisit;
const checkOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const visitUpdated = yield visit_model_1.default.findOneAndUpdate({ _id: id }, { visitEnd: new Date(), status: visit_enum_1.EVisitStatus.INACTIVE }, { new: true });
        if (visitUpdated)
            return res.status(200).json(visitUpdated);
        else
            return res.status(200).json({ message: 'No se encuentra el elemento.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.checkOut = checkOut;
const checkIfVisitNow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idGrupi = req.params.id;
        if (!idGrupi)
            return res.status(500).json({ message: 'Debe enviar idGrupi' });
        const visits = yield visit_model_1.default.find({ idGrupi: idGrupi, status: visit_enum_1.EVisitStatus.ACTIVE });
        console.log('VISITS: ', visits);
        if (visits.length > 0) {
            const place = yield place_model_1.default.findOne({ _id: visits[0].idPlace });
            if (!place)
                return res.status(400).json({ msg: 'El lugar no existe' });
            const dataVisit = {
                _id: visits[0]._id,
                idGrupi,
                idPlace: visits[0].idPlace,
                visitStart: visits[0].visitStart,
                status: visits[0].status,
                coords: place.coords,
            };
            return res.status(200).json([dataVisit]);
        }
        else {
            return res.status(200).json([]);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.checkIfVisitNow = checkIfVisitNow;
exports.default = {
    getVisit: exports.getVisit,
    getVisits: exports.getVisits,
    createVisit: exports.createVisit,
    updateVisit: exports.updateVisit,
    deleteVisit: exports.deleteVisit,
    getVisitsByPlaceId: exports.getVisitsByPlaceId,
    getVisitsStatisticsByPlaceId: exports.getVisitsStatisticsByPlaceId,
    checkOut: exports.checkOut,
    checkIfVisitNow: exports.checkIfVisitNow,
};
