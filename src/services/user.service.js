import User from '../dao/models/user.js';

export const toggleUserRole = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    user.role = user.role === 'user' ? 'admin' : 'user';
    await user.save();

    return user;
};
