import { Router } from "express";
const router = Router();
const upload = require('../middlewares/upload');

import Controller from "../controllers/user.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.post('/user-profile', Controller.updateProfile);
router.put('/:id/confirm-permissions', Controller.updateConfirmPermissions);
router.post('/user-places', Controller.updatePlaces);
router.get('/:id', Controller.getUser);
router.get('/', authValidate, Controller.getUsers);
router.put("/:id/image", upload.image.single('image'), Controller.updateImage);
router.post('/user-info/:id', Controller.getUserInfo);

router.use((err: any, req: any, res: any, next: any) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Token inválido o no proporcionado' });
    } else {
        next(err);
    }
});

export default router;