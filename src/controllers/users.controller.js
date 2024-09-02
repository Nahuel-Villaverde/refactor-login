import { toggleUserRole } from '../services/user.service.js';
import User from '../dao/models/user.js';

export const toggleUserRoleController = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }

        // Verifica el rol actual del usuario y realiza los cambios correspondientes
        if (user.role === 'admin') {
            user.role = 'user';
        } else if (user.role === 'user') {
            const requiredDocuments = ['Identificacion.txt', 'Comprobante de domicilio.txt', 'Comprobante de estado de cuenta.txt'];

            const hasAllDocuments = requiredDocuments.every(docType => {
                return user.documents.some(doc => doc.name === docType);
            });

            if (!hasAllDocuments) {
                // Asegura que siempre se devuelva JSON cuando faltan documentos
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'No se han subido los documentos necesarios para cambiar a premium: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta.' 
                });
            }

            user.role = 'admin';
        } else {
            return res.status(400).send({ status: 'error', message: 'Rol de usuario no válido para cambio' });
        }

        await user.save();

        // Destruye la sesión actual después de cambiar el rol
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({ status: 'error', message: 'Error al cerrar la sesión', error: err.message });
            }

            res.status(200).send({ status: 'success', message: `Rol cambiado a ${user.role}. Sesión cerrada.`, user });
        });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al cambiar el rol del usuario', error: error.message });
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