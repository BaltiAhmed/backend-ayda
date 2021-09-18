const express = require('express');
const route = express.Router();

const responsableControllers = require('../controllers/responsable')

const {check} = require('express-validator')

route.post('/signup', 
check('nom')
.not()
.isEmpty(),
check('prenom')
.not()
.isEmpty(),
check('tel')
.not()
.isEmpty(),
check('adresse')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, responsableControllers.signup)

route.post('/login', 
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
, responsableControllers.login)

route.get('/',responsableControllers.getResponsable)

module.exports = route