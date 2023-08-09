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
router.get('/:id', authValidate, Controller.getVisit);
router.get('/place/:id', Controller.getVisitsByPlaceId);
router.get('/place/:id/statistics', Controller.getVisitsStatisticsByPlaceId);
export default router;
