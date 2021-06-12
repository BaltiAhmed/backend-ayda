const express = require("express");
const route = express.Router();

const clientControllers = require("../controllers/client");

const { check } = require("express-validator");

route.post(
  "/signup",
  check("nom").not().isEmpty(),
  check("prenom").not().isEmpty(),
  check("tel").not().isEmpty(),
  check("adresse").not().isEmpty(),
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  clientControllers.signup
);

route.post(
  "/login",
  check("email").normalizeEmail(),
  check("password").isLength({ min: 8 }),
  clientControllers.login
);

module.exports = route;
