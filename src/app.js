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
import apiMessageRouter from './routes/api/messages.router.js'; 
import viewMessageRouter from './routes/views/messages.view.js'; 
import messageModel from './dao/models/message.model.js';
import ticketViewRouter from './routes/views/tickets.view.js';
import mockRouter from './routes/api/mock.router.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import loggerTestRouter from './routes/api/loggerTest.router.js';
import logger from './config/logger.js';

import errorHandler from './middleware/index.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;
const server = createServer(app);
const io = new Server(server);

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
.then(() => logger.info("Conectado a la base de datos"))
.catch(error => logger.error("Error en la conexión", { error }));

app.use('/api', mockRouter);
app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

app.use('/api/messages', apiMessageRouter);
app.use('/messages', viewMessageRouter);

app.use('/products', productsViewRouter);
app.use('/carts', viewRouterCart);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/tickets', ticketViewRouter);

app.use('/api', loggerTestRouter);

app.use(errorHandler);


io.on('connection', (socket) => {
    logger.info('Nuevo cliente conectado');

    socket.on('newMessage', async (data) => {
        try {
            const newMessage = await messageModel.create(data);
            io.emit('updateMessages', newMessage);
        } catch (error) {
            logger.error("Error al guardar el mensaje en la base de datos:", { error });
        }
    });

    socket.on('disconnect', () => {
        logger.info('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
