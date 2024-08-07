import CartRepository from '../services/cart.service.js';
import Cart from '../dao/models/cart.model.js';
import Ticket from '../dao/models/ticket.model.js';
import Product from '../dao/models/product.model.js';
import transporter from '../recursos/mailer.js';

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

export const purchaseCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartRepository.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        const promises = [];

        cart.products.forEach(cartProduct => {
            const productId = cartProduct.id._id;
            const quantity = cartProduct.quantity;


            promises.push(new Promise(async (resolve, reject) => {
                try {

                    const product = await Product.findById(productId);

                    if (!product) {
                        reject(`Producto con ID ${productId} no encontrado`);
                        return;
                    }


                    if (product.stock >= quantity) {

                        product.stock -= quantity;
                        await product.save();
                        resolve();
                    } else {
                        reject(`No hay suficiente stock disponible para ${product.titulo}`);
                    }
                } catch (error) {
                    reject(`Error al actualizar el stock del producto ${productId}: ${error}`);
                }
            }));
            
            totalAmount += cartProduct.id.precio * cartProduct.quantity;
        });

        await Promise.all(promises);

        const purchaserEmail = req.user.email;
        const ticketCode = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const newTicket = new Ticket({
            code: ticketCode,
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: purchaserEmail
        });

        await newTicket.save();

        const mailOptions = {
            from: 'tu_correo@gmail.com',
            to: purchaserEmail,
            subject: 'Detalle de tu compra',
            html: `<h1>Tu ticket de compra</h1>
                   <p>Código: ${newTicket.code}</p>
                   <p>Fecha y hora de compra: ${newTicket.purchase_datetime}</p>
                   <p>Total a pagar: $ ${newTicket.amount}</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
                res.status(500).json({ message: 'Error al enviar el correo electrónico' });
            } else {
                console.log('Correo electrónico enviado:', info.response);
                res.json(newTicket);
            }
        });

        await CartRepository.clearCart(cartId);
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(500).json({ message: 'Error al finalizar la compra. No hay suficiente stock disponible' });
    }
};