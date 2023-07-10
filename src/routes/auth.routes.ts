import { Router } from "express";
const router = Router();

import { confirmEmail, signIn, signUp } from "../controllers/user.controller";

router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/confirm', confirmEmail);

export default router;
