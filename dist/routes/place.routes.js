"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const place_controller_1 = __importDefault(require("../controllers/place.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.get('/', place_controller_1.default.getPlaces);
router.get('/:id', authValidate, place_controller_1.default.getPlace);
router.post('/', place_controller_1.default.createPlace);
router.put('/:id', place_controller_1.default.updatePlace);
router.delete('/:id', authValidate, place_controller_1.default.deletePlace);
exports.default = router;
