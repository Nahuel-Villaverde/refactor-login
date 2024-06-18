import { Router } from 'express';
import productModel from '../../dao/models/product.model.js';
import userModel from '../../dao/models/user.js';
import { isAuthenticated } from '../../middleware/auth.js';

const viewRouter = Router();

viewRouter.use(isAuthenticated);

viewRouter.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let categoria = req.query.categoria;
    let sort = req.query.sort;
    let disponible = req.query.disponible;

    console.log(`Limite establecido: ${limit}`);
    console.log(`Parámetro de ordenamiento recibido: ${sort}`);
    console.log(`Parámetro de disponibilidad recibido: ${disponible}`);

    try {
        let filtro = {};
        if (categoria) {
            filtro.categoria = categoria;
        }
        if (disponible !== undefined) {
            filtro.disponible = disponible === 'true';
        }

        let ordenamiento = {};
        if (sort === 'asc') {
            ordenamiento.precio = 1;
        } else if (sort === 'desc') {
            ordenamiento.precio = -1;
        }

        console.log('Objeto de ordenamiento:', ordenamiento);
        console.log('Filtro:', filtro);

        const result = await productModel.paginate(filtro, { page, limit, lean: true, sort: ordenamiento });

        const prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}${disponible !== undefined ? `&disponible=${disponible}` : ''}` : null;
        const nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}${disponible !== undefined ? `&disponible=${disponible}` : ''}` : null;

        console.log('Resultados:', {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });

        // Obtener cartId del usuario autenticado
        const user = await userModel.findById(req.user._id);
        const cartId = user.cartId;

        res.render('products', { products: result.docs, page, limit, prevLink, nextLink, categoria, sort, disponible, cartId, user: req.session.user });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).render('error', { error: 'Error al obtener los productos' });
    }
});

viewRouter.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        let product = await productModel.findById(productId).lean();

        if (!product) {
            return res.status(404).render('error', { message: "Producto no encontrado" });
        }

        // Obtener cartId del usuario autenticado
        const user = await userModel.findById(req.user._id);
        const cartId = user.cartId;

        res.render('detailProducts', { product, cartId });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "Error al obtener el producto" });
    }
});

export default viewRouter;