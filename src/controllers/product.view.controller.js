import ProductRepository from '../services/product.service.js';
import productModel from '../dao/models/product.model.js';
import userModel from '../dao/models/user.js';

export const renderProducts = async (req, res) => {
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

        const result = await ProductRepository.getProducts(filtro, { page, limit,lean:true, sort: ordenamiento });

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

        const user = await userModel.findById(req.user._id);
        const cartId = user.cartId;

        res.render('products', { products: result.docs, page, limit, prevLink, nextLink, categoria, sort, disponible, cartId, user: req.session.user, userId: user._id });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).render('error', { error: 'Error al obtener los productos' });
    }
};

export const renderProductDetail = async (req, res) => {
    try {
        const productId = req.params.id;
        let product = await ProductRepository.getProductById(productId);

        if (!product) {
            return res.status(404).render('error', { message: "Producto no encontrado" });
        }

        const user = await userModel.findById(req.user._id);
        const cartId = user.cartId;

        res.render('detailProducts', { product, cartId });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "Error al obtener el producto" });
    }
};

export const renderEditProductForm = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await ProductRepository.getProductById(productId);

        if (!product) {
            return res.status(404).render('error', { message: "Producto no encontrado" });
        }

        const user = await userModel.findById(req.user._id);
        const cartId = user.cartId;

        res.render('editProduct', { product, cartId });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "Error al obtener el producto" });
    }
};

export const renderCreateProductForm = (req, res) => {
    res.render('createProducts'); 
};

export const handleCreateProductForm = async (req, res) => {
    let { titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible } = req.body;

    if (!titulo || !descripcion || !precio || !thumbnail || !categoria || !code || stock === undefined || disponible === undefined) {
        return res.send({ status: "error", error: "Faltan parametros" });
    }

    try {
        let result = await ProductRepository.createProduct({ titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible });
        res.redirect('/products'); 
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).send({ status: "error", error: "Error al crear producto" });
    }
};