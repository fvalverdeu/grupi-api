"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req);
        // const pathImage = path.join(__dirname, `./src/assets/users/${req.params.id}`);
        const path = `./dist/assets/users/${req.params.id}`;
        // fs.mkdirSync(path, { recursive: true })
        fs_1.default.mkdir(path, err => cb(null, path));
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().getTime() + '-' + file.originalname);
        console.log(file.originalname);
        cb(null, file.originalname);
    }
});
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const maxFileSize = 1024 * 1024 * 5; // 5MB
exports.image = multer({
    storage: storage,
    limits: {
        fileSize: maxFileSize
    },
    fileFilter: imageFileFilter
});
