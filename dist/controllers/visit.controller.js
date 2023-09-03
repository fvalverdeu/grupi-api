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
exports.deleteVisit = exports.updateVisit = exports.createVisit = exports.getVisitsStatisticsByPlaceId = exports.getVisitsByPlaceId = exports.getVisits = exports.getVisit = void 0;
const visit_model_1 = __importDefault(require("../models/visit.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const place_model_1 = __importDefault(require("../models/place.model"));
const contact_enum_1 = require("../constants/contact.enum");
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
        const place = yield place_model_1.default.findOne({ _id: idPlace });
        if (!place) {
            return res.status(400).json({ msg: 'El lugar no existe' });
        }
        const visits = yield visit_model_1.default.find({ idPlace: req.params.id, status: searchTerm }).populate('idGrupi');
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
        const user = yield user_model_1.default.findOne({ _id: req.body.idUser });
        const visits = yield visit_model_1.default.find({ idPlace: req.params.id, status: 'ACTIVE' }).populate('idGrupi');
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
        };
        const currentDate = new Date();
        const listCommonPreferences = [];
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
        data.ageAverage = Math.round((totalAge / profiles.length));
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
        const user = yield user_model_1.default.findOne({ _id: idGrupi });
        if (!user)
            return res.status(400).json({ msg: 'El usuario no existe' });
        const place = yield place_model_1.default.findOne({ _id: idPlace });
        if (!place)
            return res.status(400).json({ msg: 'El lugar no existe' });
        const newVisit = new visit_model_1.default(req.body);
        yield newVisit.save();
        const number = yield visit_model_1.default.collection.countDocuments({ idGrupi: req.body.idGrupi, idplace: req.body.idPlace });
        console.log('NUMBER VISITS :::::::::::::::::::: ', number);
        if (number > 3) {
            const index = user.places.findIndex((item) => item.id === newVisit._id);
            if (index != 1) {
                const placesUpdate = user.places.push(place);
                yield user_model_1.default.findOneAndUpdate({ _id: idGrupi }, { places: placesUpdate });
            }
        }
        return res.status(200).json({ data: newVisit });
    }
    catch (error) {
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
            return res.status(200).json(visit);
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
exports.default = {
    getVisit: exports.getVisit,
    getVisits: exports.getVisits,
    createVisit: exports.createVisit,
    updateVisit: exports.updateVisit,
    deleteVisit: exports.deleteVisit,
    getVisitsByPlaceId: exports.getVisitsByPlaceId,
    getVisitsStatisticsByPlaceId: exports.getVisitsStatisticsByPlaceId,
};
