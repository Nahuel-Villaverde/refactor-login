import { Router } from 'express';
import { renderProducts, renderProductDetail, renderEditProductForm, renderCreateProductForm, handleCreateProductForm  } from '../../controllers/product.view.controller.js';
import { isAuthenticated } from '../../middleware/auth.js';
import { isAdmin } from '../../middleware/auth.js';

const viewRouter = Router();

viewRouter.use(isAuthenticated);

viewRouter.get('/', renderProducts);

viewRouter.get('/create', isAdmin, renderCreateProductForm);
viewRouter.post('/create', isAdmin, handleCreateProductForm);

viewRouter.get('/:id', renderProductDetail);

viewRouter.get('/:id/edit', isAdmin, renderEditProductForm);

export default viewRouter;