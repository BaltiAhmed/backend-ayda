const express = require("express");
const route = express.Router();

const agriculteurControllers = require("../controllers/agriculteur");

const { check } = require("express-validator");

route.post(
  "/signup",
  check("nom").not().isEmpty(),
  check("prenom").not().isEmpty(),
  check("tel").not().isEmpty(),
  check("adresse").not().isEmpty(),
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  agriculteurControllers.signup
);

route.post(
  "/login",
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  agriculteurControllers.login
);

route.get('/:id',agriculteurControllers.getAgriculteurById)
route.get('/',agriculteurControllers.getAgriculteur)


module.exports = route;
