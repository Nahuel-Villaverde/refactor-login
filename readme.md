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

Las rutas del archivo `carts.api.js` permiten crear, modificar y eliminar carritos, gestionar productos dentro de ellos, y procesar compras, verificando el stock y generando un ticket de compra que se envía al usuario. A continuación, se detallan las rutas disponibles:

- **POST /api/carts/**
  Crea un carrito nuevo.

- **GET /api/carts/:cid**
  Obtiene un carrito por su ID.

- **POST /api/carts/:cid/products/:pid**
  Agrega un producto al carrito especificado.

- **DELETE /api/carts/:cid/products/:pid**
  Elimina un producto del carrito especificado.

- **PUT /api/carts/:cid/products/:pid**
  Actualiza la cantidad de un producto en el carrito.

- **DELETE /api/carts/:cid**
  Elimina el carrito especificado.

- **POST /api/carts/:cid/purchase**
  Procesa la compra del carrito, verifica el stock, crea un ticket, envía un correo al usuario y limpia el carrito.

### Rutas de Productos

Las rutas del archivo `products.api.js` manejan los productos de la tienda, permitiendo a los usuarios visualizar, crear, modificar y eliminar productos, así como aplicar filtros y paginación para una navegación más eficiente dentro de la lista de productos disponibles. A continuación, se detallan las rutas disponibles:

- **GET /api/products/**  
  Obtiene una lista de productos. Permite aplicar filtros por categoría, disponibilidad, ordenamiento por precio ascendente o descendente, y paginación para controlar la cantidad de resultados por página.

- **GET /api/products/:id**  
  Recupera los detalles de un producto específico utilizando su ID. 

- **POST /api/products/**  
  Crea un nuevo producto en la base de datos con los detalles proporcionados en el cuerpo de la solicitud, como título, descripción, precio, categoría, y más.

- **PUT /api/products/:id**  
  Actualiza la información de un producto existente identificado por su ID con los nuevos datos proporcionados.

- **DELETE /api/products/:id**  
  Elimina un producto específico de la base de datos por su ID y envía una notificación por correo electrónico al creador del producto para informarle sobre la eliminación.

## **Rutas de Sesión**

Las rutas del archivo `session.js` manejan el registro, inicio de sesión, autenticación con terceros y el restablecimiento de contraseñas. A continuación, se detallan las rutas disponibles:

- **`POST /register`**  
  Registra un nuevo usuario en el sistema.

- **`GET /failregister`**  
  Redirige a esta ruta en caso de que el registro falle.

- **`POST /login`**  
  Inicia sesión para un usuario existente. En caso de fallo, redirige a `/faillogin`.

- **`GET /faillogin`**  
  Muestra un mensaje de error cuando el inicio de sesión falla.

- **`POST /logout`**  
  Cierra la sesión del usuario actual y redirige a la página de inicio de sesión.

- **`GET /github`**  
  Inicia el proceso de autenticación con GitHub.

- **`GET /githubcallback`**  
  Ruta de retorno para GitHub, que autentica y redirige al usuario tras el inicio de sesión.

- **`GET /google`**  
  Inicia el proceso de autenticación con Google.

- **`GET /google/callback`**  
  Ruta de retorno para Google, que autentica y redirige al usuario tras el inicio de sesión.

- **`GET /current`**  
  Devuelve la información del usuario actualmente autenticado.

- **`GET /forgot-password`**  
  Muestra la vista para restablecer la contraseña.

- **`POST /forgot-password`**  
  Envía un correo electrónico con un enlace para restablecer la contraseña.

- **`GET /reset/:token`**  
  Muestra la vista para ingresar una nueva contraseña usando un token de restablecimiento.

- **`POST /reset/:token`**  
  Maneja la actualización de la contraseña usando un token válido.

  ## **Rutas de Usuarios**

Las rutas de `users.router.js` permiten gestionar usuarios, incluyendo roles, documentos, e imágenes. A continuación se detallan las rutas disponibles:

- **`PUT /premium/:userId`**  
  Cambia el rol del usuario a `admin` tras verificar los documentos requeridos, luego puede cambiar de `admin` a `user`

- **`GET /:uid/documents`**  
  Muestra la vista para subir documentos del usuario.

- **`GET /`**  
  Obtiene una lista de todos los usuarios registrados.

- **`DELETE /`**  
  Elimina usuarios inactivos y notifica por correo electrónico.

- **`PUT /toggle-role/:userId`**  
  Cambia el rol del usuario entre `user` y `admin` sin verificación de documentos.

- **`DELETE /:userId`**  
  Elimina un usuario específico por su ID.

- **`POST /:uid/profile-image`**  
  Sube y guarda una imagen de perfil del usuario.

- **`POST /:uid/product-image`**  
  Sube y guarda una imagen de producto asociada al usuario.

- **`POST /:uid/document`**  
  Sube y guarda un documento asociado al usuario.
  
## Contacto

Para cualquier pregunta, puedes contactarme en Nahuelvillaverdeoficial@gmail.com.
