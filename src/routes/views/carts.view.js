import { Router } from 'express';
import { getCartById, addProductToCart } from '../../controllers/cart.view.controller.js';
import { isAuthenticated } from '../../middleware/auth.js';
import { isUser } from '../../middleware/auth.js';

const viewRouter = Router();

viewRouter.use(isAuthenticated);

viewRouter.get('/:cid', getCartById);
viewRouter.post('/:cid/product/:pid', isUser, addProductToCart);

export default viewRouter;
