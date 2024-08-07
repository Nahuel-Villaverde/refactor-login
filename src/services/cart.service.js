import cartModel from '../dao/models/cart.model.js';

class CartRepository {
    async createCart(cartData) {
        return await cartModel.create(cartData);
    }

    async getCartById(cartId) {
        return await cartModel.findById(cartId).populate('products.id').lean();
    }

    async addProductToCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(product => String(product.id) === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ id: productId, quantity: 1 });
        }

        await cart.save();
        return cart;
    }

    async deleteProductFromCart(cartId, productId) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(product => String(product.id) === productId);
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cart.save();
        }

        return cart;
    }

    async updateProductInCart(cartId, productId, quantity) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productInCart = cart.products.find(item => String(item.id) === productId);
        if (!productInCart) {
            throw new Error('Producto no encontrado en el carrito');
        }

        productInCart.quantity = quantity;
        await cart.save();

        return cart;
    }

    async clearCart(cartId) {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = [];
        await cart.save();

        return cart;
    }
}

export default new CartRepository();