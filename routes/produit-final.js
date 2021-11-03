const express = require("express");
const route = express.Router();

const produitControllers = require("../controllers/produit-final");

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

route.get("/", produitControllers.getProduitFinal);
route.get("/:id", produitControllers.getProduitFinalById);
route.delete("/:id", produitControllers.deleteProduit);

route.patch("/rating/:id", produitControllers.rating);

route.post("/ajoutPanier", produitControllers.ajoutProduitPanier);
route.post("/supprimerPanier", produitControllers.SuprimerProduitPanier);
route.get("/panier/:id", produitControllers.getProduitByPanier);
route.get("/commande/:id", produitControllers.getProduitByCommande);

module.exports = route;
