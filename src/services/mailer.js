import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "nahuelvillaverdeoficial@gmail.com",
        pass: "yexc erwm gccu lqwt"
    }
});

export default transporter;