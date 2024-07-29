import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el nombre del archivo y el directorio en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir los niveles personalizados y sus colores
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'cyan'
    }
};

// Crear el logger
const isDevelopment = process.env.NODE_ENV === 'development';

const transports = [
    new winston.transports.Console({
        level: isDevelopment ? 'debug' : 'info',
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    }),
    new winston.transports.File({
        filename: path.resolve(__dirname, '../logs/errors.log'),
        level: 'error',
        format: winston.format.json(),
    }),
    new winston.transports.File({
        filename: path.resolve(__dirname, '../logs/combined.log'),
        level: 'debug',
        format: winston.format.json(),
    }),
];

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: isDevelopment
        ? [transports[0], transports[2]]
        : [transports[1], transports[2]],
});

winston.addColors(customLevels.colors);

export default logger;