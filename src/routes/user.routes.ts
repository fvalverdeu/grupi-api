import { Router } from "express";
const router = Router();

import Controller from "../controllers/user.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.post('/', authValidate, Controller.updateProfile);
router.get('/profile/:id', authValidate, Controller.userProfile);
router.get('/', Controller.getUsers);

export default router;