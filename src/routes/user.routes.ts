import { Router } from "express";
const router = Router();
const upload = require('../middlewares/upload');

import Controller from "../controllers/user.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.post('/user-profile', authValidate, Controller.updateProfile);
router.put('/:id/confirm-permissions', authValidate, Controller.updateConfirmPermissions);
router.post('/user-places', authValidate, Controller.updatePlaces);
router.get('/:id', authValidate, Controller.getUser);
router.get('/', Controller.getUsers);
router.put("/:id/image", upload.image.single('image'), Controller.updateImage);

export default router;