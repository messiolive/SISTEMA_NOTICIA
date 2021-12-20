const nodemailer = require('nodemailer');

const from = 'messisoli@gmail.com';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: from,
        pass: 'Abcd@1234'
    }
});

exports.sendActivationMail = (to, id) => {
    transporter.sendMail({
        from,
        to,
        subject: 'Ativação de Conta',
        html: `
        <p>Seja bem vindo ao meu site</p>
        <p>Clique no link abaixo para ativar a sua conta</p>
        <a href="http://localhost:3000/users/activate/${id}">http://localhost:3000/users/activate/${id}</a>
        `
    }, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
}
