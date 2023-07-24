"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EUserProfileGender = exports.EUserStatus = void 0;
var EUserStatus;
(function (EUserStatus) {
    EUserStatus["UNVERIFIED"] = "UNVERIFIED";
    EUserStatus["VERIFIED"] = "VERIFIED";
    EUserStatus["ACTIVE"] = "ACTIVE";
    EUserStatus["INACTIVE"] = "INACTIVE";
})(EUserStatus || (exports.EUserStatus = EUserStatus = {}));
var EUserProfileGender;
(function (EUserProfileGender) {
    EUserProfileGender[EUserProfileGender["FEMALE"] = 0] = "FEMALE";
    EUserProfileGender[EUserProfileGender["MALE"] = 1] = "MALE";
    EUserProfileGender[EUserProfileGender["NO_BINARY"] = 2] = "NO_BINARY";
})(EUserProfileGender || (exports.EUserProfileGender = EUserProfileGender = {}));
