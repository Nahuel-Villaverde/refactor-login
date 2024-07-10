import messageModel from '../dao/models/message.model.js';

export const getAllMessages = async (req, res) => {
    try {
        const messages = await messageModel.find().lean();
        const isUser = req.user && req.user.role === 'user'; 
        const isAdmin = req.user && req.user.role === 'admin'; 

        res.render('chat', { messages, isUser, isAdmin });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los mensajes');
    }
};

export const getAllMessagesApi = async (req, res) => {
    try {
        let messages = await messageModel.find().lean();
        res.json({ status: 'success', messages });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', error: 'Error al obtener los mensajes' });
    }
};

export const createMessage = async (req, res) => {
    const { user, message } = req.body;
    if (!user || !message) {
        return res.status(400).json({ status: 'error', error: 'Faltan parámetros' });
    }
    try {
        const newMessage = await messageModel.create({ user, message });
        res.json({ status: 'success', payload: newMessage });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error al crear el mensaje' });
    }
};

export const updateMessage = async (req, res) => {
    const { uid } = req.params;
    const messageToReplace = req.body;

    if (!messageToReplace.user || !messageToReplace.message) {
        return res.status(400).json({ status: 'error', error: 'Parametros no definidos' });
    }
    try {
        const updatedMessage = await messageModel.updateOne({ _id: uid }, messageToReplace);
        res.json({ status: 'success', payload: updatedMessage });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error al actualizar el mensaje' });
    }
};

export const deleteMessage = async (req, res) => {
    const { uid } = req.params;
    try {
        const deletedMessage = await messageModel.deleteOne({ _id: uid });
        res.json({ status: 'success', payload: deletedMessage });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: 'Error al eliminar el mensaje' });
    }
};
