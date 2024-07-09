import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../../middleware/auth.js';
import UserDTO from '../../dto/UserDTO.js';

const router = Router();

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

router.get('/current', isAuthenticated, (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

export default router;
