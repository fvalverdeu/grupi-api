import { Router } from "express";
const router = Router();

import Controller from "../controllers/visit.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.get('/', Controller.getVisits);
router.get('/:id', Controller.getVisit);
router.post('/', Controller.createVisit);
router.put('/:id', Controller.updateVisit);
router.put('/check-out/:id', Controller.checkOut);
router.delete('/:id', Controller.deleteVisit);
router.get('/:id', Controller.getVisit);
router.post('/place/:id', Controller.getVisitsByPlaceId);
router.post('/place/:id/statistics', Controller.getVisitsStatisticsByPlaceId);
router.get('/verify-checkin/:id', Controller.checkIfVisitNow);
export default router;
