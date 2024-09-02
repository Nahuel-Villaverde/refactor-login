import express from 'express';
import { toggleUserRoleController, uploadProfileImage, uploadProductImage, uploadDocument, renderUploadDocuments } from '../../controllers/users.controller.js';
import { upload } from '../../middleware/multer.js'; // Importa el middleware de Multer

const router = express.Router();

router.put('/premium/:userId', toggleUserRoleController);


router.get('/:uid/documents', renderUploadDocuments);

// Rutas para subir archivos
router.post('/:uid/profile-image', upload.single('profileImage'), uploadProfileImage);
router.post('/:uid/product-image', upload.single('productImage'), uploadProductImage);
router.post('/:uid/document', upload.single('document'), uploadDocument);

export default router;