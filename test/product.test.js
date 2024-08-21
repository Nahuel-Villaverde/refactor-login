import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testeo de Productos', () => {
  
  let productId;

  it('debería crear un producto correctamente', async () => {
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
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('payload');
    expect(response.body.payload).to.have.property('_id');

    productId = response.body.payload._id;
  });

  it('debería obtener un producto por su ID', async () => {
    const response = await requester.get(`/api/products/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body.payload).to.have.property('_id', productId);
    expect(response.body.payload).to.have.property('titulo', "Producto de Prueba");
  });

  it('debería eliminar un producto correctamente', async () => {
    const deleteResponse = await requester.delete(`/api/products/${productId}`);
    expect(deleteResponse.status).to.equal(200);
    expect(deleteResponse.body).to.have.property('status', 'success');
    expect(deleteResponse.body).to.have.property('message', 'Producto eliminado exitosamente');

    // Verificar que el producto ha sido eliminado
    const getResponse = await requester.get(`/api/products/${productId}`);
    expect(getResponse.status).to.equal(404);
    expect(getResponse.body).to.have.property('result', 'error');
    expect(getResponse.body).to.have.property('message', 'Producto no encontrado');
  });
});