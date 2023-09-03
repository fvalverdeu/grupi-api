"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const preference_controller_1 = __importDefault(require("../controllers/preference.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.get('/', preference_controller_1.default.getPreference);
router.get('/:id', preference_controller_1.default.getPreferences);
router.post('/', preference_controller_1.default.createPreference);
router.put('/:id', preference_controller_1.default.updatePreference);
router.delete('/:id', preference_controller_1.default.deletePreference);
exports.default = router;
