import upload from './upload.js';

export function handleAvatarUpload(req, res, next) {

    upload.single('image')(req, res, (err) => {

        if (!err) {
            return next();
        }

        if (err.code === 'LIMIT_FILE_SIZE') {

            return res.status(400).json({
                gravity: 0,
                error: 'The image size must not exceed 6 MB.'
            });

        }

        return res.status(400).json({
            gravity: 0,
            error: err.message
        });

    });

}