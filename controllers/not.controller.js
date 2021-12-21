const { validationResult } = require('express-validator');

const bcrypt = require('bcrypt');


const UserModel = require('../models/noticia');
const states = require('../utils/states');
const mailSender = require('../utils/mail-sender');


// listar noticias
exports.listUsers = async (req, res) => {
    const users = await UserModel.find({}).lean();
    res.render('users/list',{ users });
}


// cadastro de noticias 
exports.renderCadnoticia = (req, res) => {
    res.render('users/cad-noticia', {
        states,
        user: {}
    });
}

exports.register = async (req, res) => {
    console.log('mensagem');
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.render('users/cad-noticia', {
            user: req.body,
            states,
            errors
        });
    }

    const body = req.body;
   

    const user = {
        autor: req.body.autor,
        email: req.body.email,
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        noticia: req.body.noticia,
        data: req.body.data
    };
    
    if (req.body._id) {
        await UserModel.findByIdAndUpdate(req.body._id, user)
    } else {
        const userModel = new UserModel(user);
        await userModel.save();   
    }
    res.redirect('/users/list');
}


