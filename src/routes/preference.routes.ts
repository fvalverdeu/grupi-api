import { Router } from "express";
const router = Router();

import Controller from "../controllers/preference.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.get('/', Controller.getPreference);
router.get('/:id', Controller.getPreferences);
router.post('/', Controller.createPreference);
router.put('/:id', Controller.updatePreference);
router.delete('/:id', Controller.deletePreference);

export default router;
