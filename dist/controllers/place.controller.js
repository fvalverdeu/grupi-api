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
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlaces = exports.getPlace = void 0;
const place_model_1 = __importDefault(require("../models/place.model"));
const getPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const place = yield place_model_1.default.findOne({ _id: req.params.id });
        return res.status(200).json(place);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getPlace = getPlace;
const getPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const places = yield place_model_1.default.find();
        return res.status(200).json(places);
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.getPlaces = getPlaces;
const createPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPlace = new place_model_1.default(req.body);
        yield newPlace.save();
        return res.status(200).json({ data: newPlace });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en servidor' });
    }
});
exports.createPlace = createPlace;
const updatePlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const place = req.body;
        const placeUpdated = yield place_model_1.default.findOneAndUpdate({ _id: id }, place, { new: true });
        if (placeUpdated)
            return res.status(200).json(place);
        else
            return res.status(200).json({ message: 'No se encuentra el lugar.' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.updatePlace = updatePlace;
const deletePlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { placename } = req.params;
        yield place_model_1.default.findOneAndDelete({ placename });
        return res.status(200).json({ response: 'Place deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.deletePlace = deletePlace;
exports.default = {
    getPlace: exports.getPlace,
    getPlaces: exports.getPlaces,
    createPlace: exports.createPlace,
    updatePlace: exports.updatePlace,
    deletePlace: exports.deletePlace,
};
