import { Router } from "express";
const router = Router();

import Controller from "../controllers/notification.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.get('/', Controller.getNotification);
router.get('/:id', authValidate, Controller.getNotifications);
router.get('/user/:idGrupi', authValidate, Controller.getNotificationsByUser);
router.post('/', Controller.createNotification);
router.put('/:id', Controller.updateNotification);
router.delete('/:id', authValidate, Controller.deleteNotification);

export default router;
