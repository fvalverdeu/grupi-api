import { Router } from "express";
const router = Router();

import Controller from "../controllers/place.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.get('/', Controller.getPlaces);
router.get('/:id', authValidate, Controller.getPlace);
router.post('/', Controller.createPlace);
router.put('/:id', Controller.updatePlace);
router.delete('/:id', authValidate, Controller.deletePlace);

export default router;
