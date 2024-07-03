import { Router } from 'express';
import passport from 'passport';
import { register, login, logout, githubCallback, failRegister, failLogin, getCurrentUser } from '../../controllers/session.controller.js';

const router = Router();

router.post('/register', register);
router.get('/failregister', failRegister);

router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), login);
router.get('/faillogin', failLogin);

router.post('/logout', logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), githubCallback);

router.get('/current', getCurrentUser);

export default router;
