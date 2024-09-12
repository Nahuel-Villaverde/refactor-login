import express from 'express';
import logger from '../../config/logger.js';

const router = express.Router();

router.get('/loggerTest', (req, res) => {
    logger.debug('Este es un mensaje de debug');
    logger.http('Este es un mensaje http');
    logger.info('Este es un mensaje informativo');
    logger.warning('Este es un mensaje de advertencia');
    logger.error('Este es un mensaje de error');
    logger.fatal('Este es un mensaje fatal');

    res.send('Mensajes de log enviados');
});

export default router;