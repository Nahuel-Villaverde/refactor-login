import { toggleUserRole } from '../services/user.service.js';
import User from '../dao/models/user.js';

export const toggleUserRoleController = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await toggleUserRole(userId);

        res.status(200).send({ status: 'success', message: `Rol cambiado a ${user.role}`, user });
    } catch (error) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).send({ status: 'error', message: error.message });
        } else {
            res.status(500).send({ status: 'error', message: 'Error al cambiar el rol del usuario', error: error.message });
        }
    }
};

export const renderUploadDocuments = (req, res) => {
    // Renderiza la vista y pasa el userId al frontend si es necesario
    res.render('uploadDocuments', { userId: req.params.uid });
};

export const uploadProfileImage = async (req, res) => {
    const { uid } = req.params;

    try {
        // Verifica si se ha subido un archivo
        if (!req.file) {
            return res.status(400).send({ status: 'error', error: 'No se ha subido ningún archivo' });
        }

        // Encuentra el usuario y actualiza su documento
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }

        // Actualiza el campo 'documents' en el documento del usuario
        user.documents.push({
            name: req.file.originalname,
            reference: req.file.path // Guardar la ruta del archivo en la base de datos
        });

        await user.save();

        res.status(200).send({ status: 'success', message: 'Imagen de perfil subida y registrada con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: 'error', error: 'Error al subir la imagen de perfil' });
    }
};

export const uploadProductImage = async (req, res) => {
    const { uid } = req.params;

    try {
        // Verifica si se ha subido un archivo
        if (!req.file) {
            return res.status(400).send({ status: 'error', error: 'No se ha subido ningún archivo' });
        }

        // Encuentra el usuario
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }

        // Actualiza el campo 'documents' con la imagen del producto
        user.documents.push({
            name: req.file.originalname,
            reference: req.file.path // Guardar la ruta del archivo en la base de datos
        });

        await user.save();

        res.status(200).send({ status: 'success', message: 'Imagen del producto subida y registrada con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: 'error', error: 'Error al subir la imagen del producto' });
    }
};

export const uploadDocument = async (req, res) => {
    const { uid } = req.params;

    try {
        // Verifica si se ha subido un archivo
        if (!req.file) {
            return res.status(400).send({ status: 'error', error: 'No se ha subido ningún archivo' });
        }

        // Encuentra el usuario
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }

        // Actualiza el campo 'documents' en el documento del usuario
        const document = {
            name: req.file.originalname,
            reference: req.file.path // Guardar la ruta del archivo en la base de datos
        };

        user.documents.push(document);

        await user.save();

        res.status(200).send({ status: 'success', message: 'Documento subido y registrado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: 'error', error: 'Error al subir el documento' });
    }
};