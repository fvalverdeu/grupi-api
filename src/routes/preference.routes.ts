import { Router } from "express";
const router = Router();

import Controller from "../controllers/preference.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.get('/', authValidate, Controller.getPreference);
router.get('/:id', authValidate, Controller.getPreferences);
router.post('/', authValidate, Controller.createPreference);
router.put('/:id', authValidate, Controller.updatePreference);
router.delete('/:id', authValidate, Controller.deletePreference);

export default router;
