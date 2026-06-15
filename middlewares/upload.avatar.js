import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadPath = 'uploads/temp/avatares/';

if (!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath, {recursive: true});
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {

        const extension = path.extname(file.originalname);

        const uniqueName = `temp-avatar-${crypto.randomUUID()}${extension}`;

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