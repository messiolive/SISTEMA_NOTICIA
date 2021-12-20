const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');
//const UserModel1 = require('../models/noticia');
const states = require('../utils/states');
const mailSender = require('../utils/mail-sender');

exports.listUsers = async (req, res) => {
    const users = await UserModel.find({}).lean();
    res.render('users/list');
}

/* caddro de noticias 
exports.renderCadnoticia = (req, res) => {
    res.render('users/cad-noticia', {
        states,
        user: {}
    });
}*/

exports.renderRegistration = (req, res) => {
    res.render('users/registration', {
        states,
        user: {}
    });
}


exports.register = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.render('users/registration', {
            user: req.body,
            states,
            errors
        });
    }

    const body = req.body;
    body.password = await bcrypt.hashSync(body.password, 12);
    
    const userModel = new UserModel(body);
    await userModel.save();
    

    const user = await UserModel.findOne({email: body.email});
    await mailSender.sendActivationMail(user.email, user._id);

    res.redirect('/users/registration-success');
}

exports.renderRegistrationSuccess = (req, res) => {
    res.render('users/registration-success', {activation: false});
}

exports.renderActivate = async (req, res) => {
    const id = req.params.id;
    await UserModel.updateOne({'_id': id}, {active: true});
    res.render('users/registration-success', {activation: true});
}

exports.renderLogin = (req, res) => {
    const errors = req.query.error ? [{msg: 'Email ou senha inválidos'}] : undefined;
    res.render('users/login', {errors});
}

exports.login = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.redirect('/users/login?error=true');
    }

    const body = req.body;
    const user = await UserModel.findOne({active: true, email: body.email});
    const isAuth = user?.password ? await bcrypt.compareSync(body.password, user.password) : false;

    if (!user || !isAuth) {
        return res.redirect('/users/login?error=true');
    }

    req.session.isAuth = true;
    req.session.user = {
        name: user.name,
        email: user.email,
        password: user.password,
        id: user._id
    };
    res.redirect('/');
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
}

exports.renderUpdateProfile = async (req, res) => {
    const user = await UserModel.findById(req.session.user.id).lean();
    res.render('users/update-profile', {user, states});
}

exports.renderUpdatePassword = (req, res) => {
    res.render('users/update-password');
}

exports.updatePassword = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.render('users/update-password', {errors});
    }

    const password = await bcrypt.hashSync(req.body.password, 12);
    await UserModel.updateOne({'_id': req.session.user.id}, {password});
    req.session.user.password = password;
    res.redirect('/');
}

exports.updateProfile = async (req, res) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        return res.render('users/update-profile', {user: req.body, states, errors});
    }

    await UserModel.updateOne({'_id': req.session.user.id}, req.body);
    req.session.user.name = req.body.name;
    req.session.user.email = req.body.email;
    res.redirect('/');
}

// validators

exports.uniqueEmailValidator = async (email, {req}) => {
    if (!req.session.isAuth || (req.session.isAuth && email !== req.session.user.email)) {
        const user = await UserModel.findOne({email});
        if (user) {
            throw new Error('Email já cadastrado');
        }
    }
}

exports.passwordUpdateValidator = async (password, {req}) => {
    const isOk = await bcrypt.compareSync(password, req.session.user.password);
    if (!isOk) {
        throw new Error('Senha antiga inválida');
    }
}
