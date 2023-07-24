"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.post('/user', authValidate, user_controller_1.default.updateProfile);
router.get('/user/profile/:id', authValidate, user_controller_1.default.userProfile);
exports.default = router;
