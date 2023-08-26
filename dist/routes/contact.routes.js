"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const contact_controller_1 = __importDefault(require("../controllers/contact.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.get('/', contact_controller_1.default.getContacts);
router.post('/:id', contact_controller_1.default.getContact);
router.post('/', contact_controller_1.default.createContact);
router.put('/:id', contact_controller_1.default.updateContact);
router.delete('/:id', authValidate, contact_controller_1.default.deleteContact);
router.get('/user/:id', authValidate, contact_controller_1.default.getContactsOfUser);
router.get('/recived/user/:id', authValidate, contact_controller_1.default.getRequestsRecived);
exports.default = router;
