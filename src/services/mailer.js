import nodemailer from 'nodemailer';

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "nahuelvillaverdeoficial@gmail.com",
        pass: "yexc erwm gccu lqwt"
    }
});

export default transporter;