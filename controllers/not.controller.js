const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


const UserModel = require('../models/noticia');
const states = require('../utils/states');
const mailSender = require('../utils/mail-sender');



// cadastro de noticias 
exports.renderCadnoticia = (req, res) => {
    res.render('users/cad-noticia', {
        states,
        user: {}
    });
}

exports.register = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.render('users/cad-noticia', {
            user: req.body,
            states,
            errors
        });
    }

    const body = req.body;
    body.password = await bcrypt.hashSync(body.password, 12);

    const userModel = new UserModel(body);
    await userModel.save();


    const user = await UserModel.findOne({ email: body.email });
    await mailSender.sendActivationMail(user.email, user._id);

    res.redirect('/secrets/secret');
}


