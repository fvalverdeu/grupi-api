import { Router } from "express";
const router = Router();

import Controller from "../controllers/auth.controller";

router.post('/signin', Controller.signIn);
router.post('/signup', Controller.signUp);
router.post('/confirm', Controller.confirmEmail);
router.post('/send-confirmation-code', Controller.sendCode);
router.post('/recover-password', Controller.recoverPassword);

export default router;
