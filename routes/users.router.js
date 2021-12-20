const express = require('express');
const {check, body} = require('express-validator');

const usersCtrl = require('../controllers/users.controller');
const usersCtrl1 = require('../controllers/not.controller');
const security = require('../utils/security');

const router = express.Router();

const emailValidator = () => {
  return [
    check('email').notEmpty().withMessage('Campo email não pode ser vázio'),
    body('email').trim().toLowerCase().normalizeEmail(),
    check('email').isEmail().withMessage('Email inválido')
  ];
}

const uniqueEmailValidator = () => {
  return [check('email').custom(usersCtrl.uniqueEmailValidator)];
}

const passwordUpdateValidator = () => {
  return [check('oldPassword').custom(usersCtrl.passwordUpdateValidator)];
}

const passwordValidator = () => {
  return [
      check('password').notEmpty().withMessage('Campo senha não pode ser vázio'),
      check('password').isLength({min: 6, max: 20}).withMessage('Senha deve ter entre 6 a 20 caracteres')
  ];
}

const passwordConfirmatonValidator = () => {
  return [
      check('passwordConfirmation')
          .exists()
          .custom((value, {req}) => value === req.body.password)
          .withMessage('A senha não foi confirmada')
  ];
}

const generalInfoValidator = () => {
  return [
      check('name').notEmpty().withMessage('Campo nome não pode ser vázio'),
      check('address').notEmpty().withMessage('Campo endereço não pode ser vazio'),
      check('state').notEmpty().withMessage('Campo estado não pode ser vazio'),
      check('city').notEmpty().withMessage('Campo cidade não pode ser vazio'),
      check('zipcode').matches(/^\d{5}-\d{3}$/) .withMessage('CEP inválido'),
      check('gender').notEmpty().withMessage('Campo sexo não pode ser vázio')
  ]
}

// rotas
router.get('/cad-noticia', usersCtrl1.renderCadnoticia);
router.get('/list', usersCtrl.listUsers);
router.get('/registration', usersCtrl.renderRegistration);

router.post('/registration', [
  emailValidator(),
  uniqueEmailValidator(),
  passwordValidator(),
  passwordConfirmatonValidator(),
  generalInfoValidator()
], usersCtrl.register);

router.get('/registration-success', usersCtrl.renderRegistrationSuccess);
router.get('/activate/:id', usersCtrl.renderActivate);

router.get('/login', usersCtrl.renderLogin);
router.get('/logout', usersCtrl.logout);
router.post('/login', [
  emailValidator(),
  passwordValidator()
], usersCtrl.login);

router.get('/update-profile', security.isAuth, usersCtrl.renderUpdateProfile);
router.post('/update-profile', [
  security.isAuth,
  uniqueEmailValidator(),
  emailValidator(),
  generalInfoValidator()
], usersCtrl.updateProfile)

router.get('/update-password', security.isAuth, usersCtrl.renderUpdatePassword);
router.post('/update-password', [
  security.isAuth,
  passwordUpdateValidator(),
  passwordValidator(),
  passwordConfirmatonValidator()
], usersCtrl.updatePassword)


module.exports = router;
