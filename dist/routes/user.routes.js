"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const upload = require('../middlewares/upload');
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.post('/user-profile', authValidate, user_controller_1.default.updateProfile);
router.put('/:id/confirm-permissions', authValidate, user_controller_1.default.updateConfirmPermissions);
router.post('/user-places', authValidate, user_controller_1.default.updatePlaces);
router.get('/:id', authValidate, user_controller_1.default.getUser);
router.get('/', user_controller_1.default.getUsers);
router.put("/:id/image", upload.image.single('image'), user_controller_1.default.updateImage);
exports.default = router;
