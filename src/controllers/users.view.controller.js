import User from '../dao/models/user.js';

// Controlador para obtener todos los usuarios con datos principales
export const getAllUsers = async (req, res) => {
    try {
        // Obtiene los usuarios, seleccionando solo los campos deseados
        const users = await User.find({}, 'first_name last_name email role _id');

        // Formatea la respuesta para devolver un arreglo de objetos con los campos principales
        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }));

        // Renderiza la vista de Handlebars con los usuarios obtenidos
        res.render('usersList', { users: formattedUsers });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al obtener los usuarios', error: error.message });
    }
};
