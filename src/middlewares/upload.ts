import fs from 'fs';
const multer = require('multer');
// const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    console.log(req)
    const path = `./src/users/${req.params.id}`;
    // fs.mkdirSync(path, { recursive: true })
    fs.mkdir(path, err => cb(null, path));
  },
  filename: function (req: any, file: any, cb: any) {
    // cb(null, new Date().getTime() + '-' + file.originalname);
    console.log(file.originalname);
    cb(null, file.originalname);
  }
});

const imageFileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
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


