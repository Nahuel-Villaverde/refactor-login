import { Router } from 'express';
import { generateMockProducts } from '../../recursos/mocking.js';

const router = Router();

router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

export default router;