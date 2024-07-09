import CartRepository from '../repositories/cart.repository.js';
import productModel from '../dao/models/product.model.js'; // Importar solo si es necesario

export const createCart = async (req, res) => {
    const { products } = req.body;

    if (!products) {
        return res.status(400).send({ status: "error", error: "Faltan parámetros: 'products' es requerido" });
    }

    try {
        let result = await CartRepository.createCart({ products });
        res.status(201).send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).send({ status: "error", error: "Error al crear el carrito" });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        let cart = await CartRepository.getCartById(cartId);

        if (!cart) {
            return res.status(404).send({ result: "error", message: "Carrito no encontrado" });
        }

        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ result: "error", message: "Error al obtener el Carrito" });
    }
};

export const addProductToCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        let cart = await CartRepository.addProductToCart(cartId, productId);
        res.json({ result: "success", payload: cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};

export const deleteProductFromCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        let cart = await CartRepository.deleteProductFromCart(cartId, productId);
        res.json({ result: "success", payload: cart });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar producto del carrito' });
    }
};

export const updateProductInCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;

    try {
        let cart = await CartRepository.updateProductInCart(cartId, productId, quantity);
        res.json({ result: "success", payload: cart });
    } catch (error) {
        console.error('Error al actualizar el producto en el carrito:', error);
        res.status(500).json({ error: 'Error al actualizar el producto en el carrito' });
    }
};

export const clearCart = async (req, res) => {
    const { cid } = req.params;

    try {
        let cart = await CartRepository.clearCart(cid);
        res.json({ result: "success", payload: cart });
    } catch (error) {
        console.error('Error al eliminar los productos del carrito:', error);
        res.status(500).json({ error: 'Error al eliminar los productos del carrito' });
    }
};