import User from '../dao/models/user.js';
import passport from 'passport';
import { 
    createUserAndCart, 
    generatePasswordResetToken, 
    sendPasswordResetEmail, 
    validateAndUpdatePassword 
} from '../services/sessions.service.js';

export const register = async (req, res, next) => {
    passport.authenticate('register', { failureRedirect: 'failregister' }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('failregister');
        }

        try {
            await createUserAndCart(user);
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/login');
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send({ status: "error", error: error.message });
        }
    })(req, res, next);
};

export const login = (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Datos incompletos" });
    try {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
            cartId: req.user.cartId,
        };
        console.log(req.session.user);
        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
};

export const githubCallback = async (req, res) => {
    try {
        if (!req.user.cartId) {
            await createUserAndCart(req.user);
        }
        req.session.user = req.user;
        res.redirect("/products");
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const failRegister = (req, res) => {
    console.log("Estrategia fallida");
    res.send({ error: "Falló" });
};

export const failLogin = (req, res) => {
    res.send({ error: "Login fallido" });
};

export const getCurrentUser = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).send(req.user);
    } else {
        return res.status(401).send({ status: "error", error: "Usuario no autenticado" });
    }
};

export const renderForgotPassword = (req, res) => {
    res.render('forgot-password');
};

export const handleForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ status: "error", error: "Usuario no encontrado" });
        }

        const token = await generatePasswordResetToken(user);
        await sendPasswordResetEmail(user, token, req.headers.host);

        res.status(200).send({ message: 'Correo electrónico de restablecimiento de contraseña enviado' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const renderPasswordReset = async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
        console.log(`Usuario no encontrado para el token: ${token}`);
        return res.status(400).send('El token de restablecimiento de contraseña no es válido o ha expirado.');
    }

    console.log(`Usuario encontrado: ${user.email}`);
    res.render('reset', { token });
};

export const handlePasswordReset = async (req, res) => {
    const token = req.params.token;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('El token de restablecimiento de contraseña no es válido o ha expirado.');
        }

        await validateAndUpdatePassword(user, password);
        res.redirect('/login');
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error al manejar el restablecimiento de contraseña. La nueva contraseña no puede ser la misma que la anterior.');
    }
};
