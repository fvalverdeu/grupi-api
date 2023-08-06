import { Router } from "express";
const router = Router();

import { confirmEmail, sendCode, signIn, signUp } from "../controllers/user.controller";

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/confirm', confirmEmail);
// validar seguridad de envío mediante token
router.post('/send-code', sendCode);

export default router;
