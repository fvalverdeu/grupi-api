import { Router } from "express";
const router = Router();

import Controller from "../controllers/contact.controller";
import passport from "passport";

const authValidate = passport.authenticate('jwt', { session: false });

router.get('/', Controller.getContacts);
router.post('/:id', Controller.getContact);
router.post('/', Controller.createContact);
router.put('/:id', Controller.updateContact);
router.delete('/:id', authValidate, Controller.deleteContact);
router.get('/user/:id', authValidate, Controller.getContactsOfUser);
router.get('/recived/user/:id', authValidate, Controller.getRequestsRecived);

export default router;
