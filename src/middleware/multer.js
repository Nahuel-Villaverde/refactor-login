// middlewares/multer.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configuración de Multer para diferentes tipos de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';

        // Determinar la carpeta según el tipo de archivo
        if (file.fieldname === 'profileImage') {
            folder = 'uploads/profiles';
        } else if (file.fieldname === 'productImage') {
            folder = 'uploads/products';
        } else if (file.fieldname === 'document') {
            folder = 'uploads/documents';
        }

        // Crear la carpeta si no existe
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
    // Puedes agregar lógica adicional para filtrar tipos de archivos
    cb(null, true);
};

export const upload = multer({ storage, fileFilter });
