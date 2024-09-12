import User from '../dao/models/user.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'first_name last_name email role _id');

        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }));

        res.render('usersList', { users: formattedUsers });
    } catch (error) {
        res.status(500).render('error', { message: 'Error al obtener los usuarios', error: error.message });
    }
};
