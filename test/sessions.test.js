import { expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');

describe('Testeo de Sessions', () => {
  let userId;
  let userToken;

  it('debería registrar un nuevo usuario correctamente', async () => {
    const newUser = {
      first_name: "Juan",
      last_name: "Pérez",
      email: "juan.perez@example.com",
      password: "password123",
    };

    const response = await requester.post('/api/sessions/register').send(newUser);
    expect(response.status).to.equal(302);
  });

  it('debería iniciar sesión correctamente', async () => {
    const loginUser = {
      email: "juan.perez@example.com",
      password: "password123",
    };

    const response = await requester.post('/api/sessions/login').send(loginUser);
    expect(response.status).to.equal(302);
    expect(response.headers).to.have.property('location', '/products');

    userToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('debería obtener el usuario actual', async () => {
    const response = await requester
      .get('/api/sessions/current')
      .set('Cookie', [`connect.sid=${userToken}`]);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('email', 'juan.perez@example.com');
  });

  it('debería cerrar sesión correctamente', async () => {
    const response = await requester.post('/api/sessions/logout').set('Cookie', [`connect.sid=${userToken}`]);
    expect(response.status).to.equal(302);
    expect(response.headers).to.have.property('location', '/login');

    // Intentar obtener el usuario actual después de cerrar sesión
    const currentUserResponse = await requester
      .get('/api/sessions/current')
      .set('Cookie', [`connect.sid=${userToken}`]);

    expect(currentUserResponse.status).to.equal(401);
    expect(currentUserResponse.body).to.have.property('status', 'error');
    expect(currentUserResponse.body).to.have.property('error', 'Usuario no autenticado');
  });
});
