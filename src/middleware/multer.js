import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';

        if (file.fieldname === 'profileImage') {
            folder = 'uploads/profiles';
        } else if (file.fieldname === 'productImage') {
            folder = 'uploads/products';
        } else if (file.fieldname === 'document') {
            folder = 'uploads/documents';
        }

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    cb(null, true);
};

export const upload = multer({ storage, fileFilter });
