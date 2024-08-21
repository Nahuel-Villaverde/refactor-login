import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testeo de Carritos', () => {

  let cartId;
  let productId;

  before(async () => {
    // Crear un producto para usarlo en los tests del carrito
    const newProduct = {
      titulo: "Producto de Prueba",
      descripcion: "Descripción del producto de prueba",
      precio: 100,
      thumbnail: "imagen.jpg",
      categoria: "Categoría de Prueba",
      code: "ABC123",
      stock: 10,
      disponible: true
    };

    const response = await requester.post('/api/products').send(newProduct);
    productId = response.body.payload._id;
  });

  it('debería crear un carrito correctamente', async () => {
    const response = await requester.post('/api/carts').send({ products: [] });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('result', 'success');
    expect(response.body.payload).to.have.property('_id');

    cartId = response.body.payload._id;
  });

  it('debería obtener un carrito por su ID', async () => {
    const response = await requester.get(`/api/carts/${cartId}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property('_id', cartId);
  });

  it('debería agregar un producto al carrito', async () => {
    const response = await requester.post(`/api/carts/${cartId}/products/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('result', 'success');

    const cartResponse = await requester.get(`/api/carts/${cartId}`);
    expect(cartResponse.status).to.equal(200);
    expect(cartResponse.body.payload.products).to.be.an('array').that.is.not.empty;
    expect(cartResponse.body.payload.products[0]).to.have.property('id').that.has.property('_id', productId);
  });

  it('debería eliminar un producto del carrito', async () => {
    const response = await requester.delete(`/api/carts/${cartId}/products/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('result', 'success');

    const cartResponse = await requester.get(`/api/carts/${cartId}`);
    expect(cartResponse.status).to.equal(200);
    expect(cartResponse.body.payload.products).to.be.an('array').that.is.empty;
  });

});
