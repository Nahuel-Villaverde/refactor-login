import ProductRepository from '../repositories/product.repository.js';

export const getProducts = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let categoria = req.query.categoria;
    let sort = req.query.sort;
    let disponible = req.query.disponible;

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

        const result = await ProductRepository.getProducts(filtro, { page, limit, lean: true, sort: ordenamiento });

        const prevLink = result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}${disponible !== undefined ? `&disponible=${disponible}` : ''}` : null;
        const nextLink = result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&categoria=${categoria || ''}&sort=${sort || ''}${disponible !== undefined ? `&disponible=${disponible}` : ''}` : null;

        res.json({
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
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ status: 'error', error: 'Error al obtener los productos' });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        let product = await ProductRepository.getProductById(productId);

        if (!product) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        res.send({ result: "success", payload: product });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "error", message: "Error al obtener el producto" });
    }
};

export const createProduct = async (req, res) => {
    let { titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible } = req.body;

    if (!titulo || !descripcion || !precio || !thumbnail || !categoria || !code || stock === undefined || disponible === undefined) {
        return res.send({ status: "error", error: "Faltan parametros" });
    }

    try {
        let result = await ProductRepository.createProduct({ titulo, descripcion, precio, thumbnail, categoria, code, stock, disponible });
        res.send({ status: "success", payload: result });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).send({ status: "error", error: "Error al crear producto" });
    }
};

export const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedProduct = req.body;

    if (!updatedProduct || Object.keys(updatedProduct).length === 0) {
        return res.status(400).send({ status: "error", error: "Faltan parametros para actualizar" });
    }

    try {
        const product = await ProductRepository.updateProduct(productId, updatedProduct);

        if (!product) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        res.send({ status: "success", payload: product });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).send({ status: "error", error: "Error al actualizar producto" });
    }
};

export const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const result = await ProductRepository.deleteProduct(productId);

        if (!result) {
            return res.status(404).send({ result: "error", message: "Producto no encontrado" });
        }

        res.send({ status: "success", message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send({ status: "error", error: "Error al eliminar producto" });
    }
};