# Ecommerce con Registro de Usuarios y Autenticación

## Descripción

Este proyecto es un ecommerce que permite a los usuarios visualizar productos, agregarlos al carrito, y realizar compras. Al finalizar una compra, los usuarios reciben un correo con el ticket de compra. La aplicación también incluye un chat en tiempo real. Existen dos roles principales:

- **Admin:** Puede crear, modificar y eliminar productos, ver todos los usuarios, cambiar roles y eliminar usuarios. El admin no puede escribir en el chat ni comprar productos.
- **User:** Puede comprar productos y escribir en el chat.

La aplicación utiliza paginación y filtros para visualizar productos por categoría y ordenamiento. La base de datos está implementada con MongoDB y Mongoose.

## Tecnologías Utilizadas

- **Backend:**
  - [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker)
  - [bcrypt](https://www.npmjs.com/package/bcrypt)
  - [bcryptjs](https://www.npmjs.com/package/bcryptjs)
  - [body-parser](https://www.npmjs.com/package/body-parser)
  - [connect-mongo](https://www.npmjs.com/package/connect-mongo)
  - [dotenv](https://www.npmjs.com/package/dotenv)
  - [express](https://www.npmjs.com/package/express)
  - [express-handlebars](https://www.npmjs.com/package/express-handlebars)
  - [express-session](https://www.npmjs.com/package/express-session)
  - [mongodb](https://www.npmjs.com/package/mongodb)
  - [mongoose](https://www.npmjs.com/package/mongoose)
  - [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2)
  - [multer](https://www.npmjs.com/package/multer)
  - [nodemailer](https://www.npmjs.com/package/nodemailer)
  - [passport](https://www.npmjs.com/package/passport)
  - [passport-github2](https://www.npmjs.com/package/passport-github2)
  - [passport-google-oauth20](https://www.npmjs.com/package/passport-google-oauth20)
  - [passport-local](https://www.npmjs.com/package/passport-local)
  - [socket.io](https://www.npmjs.com/package/socket.io)
  - [supertest](https://www.npmjs.com/package/supertest)
  - [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
  - [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
  - [winston](https://www.npmjs.com/package/winston)

- **Testing:**
  - [chai](https://www.npmjs.com/package/chai)
  - [mocha](https://www.npmjs.com/package/mocha)

## Instalación

1. Clona el repositorio:
    ```bash
    git clone [URL del repositorio]
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd [nombre_del_directorio]
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```

## Configuración

Copia el archivo `.env.example` a un archivo `.env` y completa las siguientes variables:

```env
# Puerto en el que se ejecuta el servidor
PORT=

# URL de conexión a MongoDB
MONGO_URL=

# Credenciales para la autenticación con GitHub
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Credenciales para la autenticación con Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Uso

Para iniciar la aplicación en local, sigue estos pasos:

1. **Inicia el servidor**:
    ```bash
    npm start
    ```
   Esto iniciará el servidor en el puerto especificado en el archivo `.env`.

2. **Accede a la aplicación**:
   Abre tu navegador y navega a `http://localhost:[PUERTO]` para ver la aplicación en funcionamiento.

3. **Realiza peticiones a la API**:
   Utiliza herramientas como Postman o cURL para interactuar con los endpoints de la API y verificar su funcionalidad.

## Endpoints

### Carritos

- **POST /api/carts/**
  - **Descripción:** Crea un carrito nuevo.

- **GET /api/carts/:cid**
  - **Descripción:** Obtiene un carrito por su ID.

- **POST /api/carts/:cid/products/:pid**
  - **Descripción:** Agrega un producto al carrito especificado.

- **DELETE /api/carts/:cid/products/:pid**
  - **Descripción:** Elimina un producto del carrito especificado.

- **PUT /api/carts/:cid/products/:pid**
  - **Descripción:** Actualiza la cantidad de un producto en el carrito.

- **DELETE /api/carts/:cid**
  - **Descripción:** Elimina el carrito especificado.

- **POST /api/carts/:cid/purchase**
  - **Descripción:** Procesa la compra del carrito, verifica el stock, crea un ticket, envía un correo al usuario y limpia el carrito.

## Contacto

Para cualquier pregunta, puedes contactarme en Nahuelvillaverdeoficial@gmail.com.
