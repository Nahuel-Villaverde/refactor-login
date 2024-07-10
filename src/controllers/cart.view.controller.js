import CartRepository from '../repositories/cart.repository.js';

export const getCartById = async (req, res) => {
    try {
        const cartId = req.user.cartId;
        const cart = await CartRepository.getCartById(cartId);

        if (!cart) {
            return res.status(404).render('error', { message: "Carrito no encontrado" });
        }

        console.log("ESTE ES EL CARRITO", cart);

        res.render('cart', { cart, cartId });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: "Error al obtener el Carrito" });
    }
};

export const addProductToCart = async (req, res) => {
    const cartId = req.params.cid || req.user.cartId;
    const productId = req.params.pid;

    try {
        await CartRepository.addProductToCart(cartId, productId);
        res.status(200)
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
};