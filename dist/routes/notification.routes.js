"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const notification_controller_1 = __importDefault(require("../controllers/notification.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.get('/', notification_controller_1.default.getNotification);
router.get('/:id', authValidate, notification_controller_1.default.getNotifications);
router.get('/user/:idGrupi', authValidate, notification_controller_1.default.getNotificationsByUser);
router.post('/', notification_controller_1.default.createNotification);
router.put('/:id', notification_controller_1.default.updateNotification);
router.delete('/:id', authValidate, notification_controller_1.default.deleteNotification);
exports.default = router;
