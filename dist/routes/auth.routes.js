"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.post('/signin', auth_controller_1.default.signIn);
router.post('/signup', auth_controller_1.default.signUp);
router.post('/confirm', auth_controller_1.default.confirmEmail);
router.post('/send-confirmation-code', auth_controller_1.default.sendCode);
router.post('/recover-password', auth_controller_1.default.recoverPassword);
router.post('/refresh-token', auth_controller_1.default.refreshToken);
exports.default = router;
