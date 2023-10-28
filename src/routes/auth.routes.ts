import { Router } from "express";
const router = Router();

import Controller from "../controllers/auth.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.post('/signin', Controller.signIn);
router.post('/signup', Controller.signUp);
router.post('/confirm', Controller.confirmEmail);
router.post('/send-confirmation-code', Controller.sendCode);
router.post('/recover-password', Controller.recoverPassword);
router.post('/refresh-token', Controller.refreshToken);

export default router;
