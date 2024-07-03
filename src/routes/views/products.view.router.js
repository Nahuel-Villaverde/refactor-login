import { Router } from 'express';
import { renderProducts, renderProductDetail } from '../../controllers/product.view.controller.js';
import { isAuthenticated } from '../../middleware/auth.js';

const viewRouter = Router();

viewRouter.use(isAuthenticated);

viewRouter.get('/', renderProducts);
viewRouter.get('/:id', renderProductDetail);

export default viewRouter;