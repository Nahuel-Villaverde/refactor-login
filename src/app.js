import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import cartRouter from './routes/api/carts.api.js';
import productRouter from './routes/api/products.api.js';
import productsViewRouter from './routes/views/products.view.js';
import viewRouterCart from './routes/views/carts.view.js';
import sessionsRouter from './routes/api/sessions.js';
import viewsRouter from './routes/views/profile.views.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
    }),
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: {
        eq: (v1, v2) => v1 === v2,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URL)
.then(() => { console.log("Conectado a la base de datos") })
.catch(error => console.error("Error en la conexión", error));

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);
app.use('/products', productsViewRouter);
app.use('/carts', viewRouterCart);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});