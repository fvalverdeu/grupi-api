"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const visit_controller_1 = __importDefault(require("../controllers/visit.controller"));
const passport_1 = __importDefault(require("passport"));
const authValidate = passport_1.default.authenticate('jwt', { session: false });
router.get('/', visit_controller_1.default.getVisits);
router.get('/:id', authValidate, visit_controller_1.default.getVisit);
router.post('/', visit_controller_1.default.createVisit);
router.put('/:id', visit_controller_1.default.updateVisit);
router.delete('/:id', authValidate, visit_controller_1.default.deleteVisit);
router.get('/:id', authValidate, visit_controller_1.default.getVisit);
router.get('/place/:id', visit_controller_1.default.getVisitsByPlaceId);
router.get('/place/:id/statistics', visit_controller_1.default.getVisitsStatisticsByPlaceId);
exports.default = router;
