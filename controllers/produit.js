const httpError = require("../models/error");

const produit = require("../models/produit");

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, region, prix, description, quantite } = req.body;

  const createdProduit = new produit({
    nom,
    image: req.file.path,
    region,
    prix,
    quantite,
    description,
  });

  try {
    await createdProduit.save();
  } catch (err) {
    const error = new httpError("failed ", 500);
    return next(error);
  }

  res.status(201).json({
    produit: createdProduit,
  });
};


exports.ajout = ajout