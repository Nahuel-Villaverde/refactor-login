import { Router } from 'express';
import { renderProducts, renderProductDetail, renderEditProductForm, renderCreateProductForm, handleCreateProductForm  } from '../../controllers/product.view.controller.js';
import { isAuthenticated } from '../../middleware/auth.js';

const viewRouter = Router();

viewRouter.use(isAuthenticated);

viewRouter.get('/', renderProducts);

viewRouter.get('/create', renderCreateProductForm);
viewRouter.post('/create', handleCreateProductForm);

viewRouter.get('/:id', renderProductDetail);
viewRouter.get('/:id/edit', renderEditProductForm);

export default viewRouter;