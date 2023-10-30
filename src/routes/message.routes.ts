import { Router } from "express";
const router = Router();

import Controller from "../controllers/message.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

// router.get('/', authValidate, Controller.getMessage);
router.post('/historial', authValidate, Controller.getChatHistorial);
// router.get('/:id', authValidate, Controller.getMessages);
// router.post('/', authValidate, Controller.createMessage);
// router.put('/:id', authValidate, Controller.updateMessage);
// router.delete('/:id', authValidate, Controller.deleteMessage);

export default router;
