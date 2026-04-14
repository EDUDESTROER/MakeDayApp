import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = 'uploads/';

if (!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: {fileSize: 6 * 1024 * 1024}, //6MB!
    fileFilter: (req, file, cb) =>{
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error('Only images are Allowed'));
        }
    }
});

export default upload;