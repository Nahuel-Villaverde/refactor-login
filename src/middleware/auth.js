export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // El usuario es admin, continúa con la siguiente función de middleware
    } else {
        res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
    }
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next(); // El usuario es un user, continúa con la siguiente función de middleware
    } else {
        res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
    }
};