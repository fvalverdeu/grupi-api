import { Router } from "express";
const router = Router();

import { signIn, signUp } from "../controllers/user.controller";

router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;
