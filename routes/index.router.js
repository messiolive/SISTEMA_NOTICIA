const express = require('express');

const security = require('../utils/security');

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/secret', security.isAuth, (req, res) => {
  res.render('secrets/secret');
});

module.exports = router;
