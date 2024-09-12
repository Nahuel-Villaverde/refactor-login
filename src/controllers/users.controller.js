import { toggleUserRole } from '../services/user.service.js';
import User from '../dao/models/user.js';
import transporter from '../recursos/mailer.js';

export const toggleUserRoleController = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }

        if (user.role === 'admin') {
            user.role = 'user';
        } else if (user.role === 'user') {
            const requiredDocuments = ['Identificacion.txt', 'Comprobante de domicilio.txt', 'Comprobante de estado de cuenta.txt'];

            const hasAllDocuments = requiredDocuments.every(docType => {
                return user.documents.some(doc => doc.name === docType);
            });

            if (!hasAllDocuments) {
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
    res.render('uploadDocuments', { userId: req.params.uid });
};

export const uploadProfileImage = async (req, res) => {
    const { uid } = req.params;

    try {
        if (!req.file) {
            return res.status(400).send({ status: 'error', error: 'No se ha subido ningún archivo' });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }

        user.documents.push({
            name: req.file.originalname,
            reference: req.file.path 
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
        if (!req.file) {
            return res.status(400).send({ status: 'error', error: 'No se ha subido ningún archivo' });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }

        user.documents.push({
            name: req.file.originalname,
            reference: req.file.path 
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
        if (!req.file) {
            return res.status(400).send({ status: 'error', error: 'No se ha subido ningún archivo' });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
        }

        const document = {
            name: req.file.originalname,
            reference: req.file.path
        };

        user.documents.push(document);

        await user.save();

        res.status(200).send({ status: 'success', message: 'Documento subido y registrado con éxito' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: 'error', error: 'Error al subir el documento' });
    }
};


export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, 'first_name last_name email role _id');
      
      const formattedUsers = users.map(user => ({
        id: user._id.toString(),
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role
      }));
  
      console.log('Usuarios obtenidos:', formattedUsers);
  
      res.status(200).json({ status: 'success', users: formattedUsers });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al obtener los usuarios', error: error.message });
    }
  };
  


export const deleteInactiveUsers = async (req, res) => {
    try {
        const cutoffDate = new Date(Date.now() - 2 * 60 * 1000); // Cambia a 2 días (2 * 24 * 60 * 60 * 1000)

        const inactiveUsers = await User.find({ last_connection: { $lt: cutoffDate } });

        if (inactiveUsers.length === 0) {
            return res.status(200).send({ message: 'No hay usuarios inactivos para eliminar.' });
        }

        const deletedUsers = await User.deleteMany({ last_connection: { $lt: cutoffDate } });

        for (const user of inactiveUsers) {
            await transporter.sendMail({
                from: 'nahuelvillaverdeoficial@gmail.com',
                to: user.email,
                subject: 'Cuenta eliminada por inactividad',
                text: `Hola ${user.first_name}, tu cuenta ha sido eliminada por inactividad.`,
            });
        }

        res.status(200).send({ message: 'Usuarios inactivos eliminados y notificados.', count: deletedUsers.deletedCount });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).send({ message: 'Error al eliminar usuarios inactivos.', error: error.message });
    }
};


export const toggleUserRoleSimple = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }
  
      user.role = user.role === 'user' ? 'admin' : 'user';
      await user.save();
  
      res.status(200).json({ status: 'success', message: `Rol cambiado a ${user.role}`, user });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al cambiar el rol del usuario', error: error.message });
    }
  };


  export const deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Error al eliminar el usuario', error: error.message });
    }
  };