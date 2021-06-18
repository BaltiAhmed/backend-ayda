const express = require("express");
const route = express.Router();

const produitControllers = require("../controllers/produit");

const { check } = require("express-validator");

const fileUpload = require("../middleware/file-upload");

route.post(
  "/ajout",
  fileUpload.single("image"),
  [
    check("nom").not().isEmpty(),
    check("region").not().isEmpty(),
    check("prix").not().isEmpty(),
    check("quantite").not().isEmpty(),
    check("description").not().isEmpty(),
  ],
  produitControllers.ajout
);

module.exports = route;
