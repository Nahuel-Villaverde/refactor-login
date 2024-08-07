import { toggleUserRole } from '../services/user.service.js';

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