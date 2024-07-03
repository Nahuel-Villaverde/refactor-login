import passport from 'passport';
import User from '../dao/models/user.js';
import cartModel from '../dao/models/cart.model.js';

export const register = async (req, res, next) => {
    passport.authenticate('register', { failureRedirect: 'failregister' }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('failregister');
        }

        try {
            const newCart = await cartModel.create({ products: [] });
            user.cartId = newCart._id;
            await user.save();
            req.login(user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/login');
            });
        } catch (error) {
            console.error('Error al crear el carrito para el usuario:', error);
            res.status(500).send({ status: "error", error: "Error al crear el carrito para el usuario" });
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
            const newCart = await cartModel.create({ products: [] });
            req.user.cartId = newCart._id;
            await req.user.save();
        }
        req.session.user = req.user;
        res.redirect("/products");
    } catch (error) {
        console.error('Error al asignar el carrito al usuario:', error);
        res.status(500).send({ status: "error", error: "Error al asignar el carrito al usuario" });
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
