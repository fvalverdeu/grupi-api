import { Router } from "express";
const router = Router();

import Controller from "../controllers/visit.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.get('/', Controller.getVisits);
router.get('/:id', authValidate, Controller.getVisit);
router.post('/', Controller.createVisit);
router.put('/:id', Controller.updateVisit);
router.delete('/:id', authValidate, Controller.deleteVisit);

export default router;
