import { Router } from "express";
const router = Router();

import Controller from "../controllers/user.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.post('/user', authValidate, Controller.updateProfile);
router.get('/user/profile/:id', authValidate, Controller.userProfile);
router.get('/', Controller.getUsers);

export default router;