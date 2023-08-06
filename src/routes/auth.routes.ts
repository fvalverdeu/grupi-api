import { Router } from "express";
const router = Router();

import { confirmEmail, sendCode, signIn, signUp } from "../controllers/user.controller";

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/confirm', confirmEmail);
router.post('/send-code', sendCode); // validar seguridad de envío mediante token

export default router;
