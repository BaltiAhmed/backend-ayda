const httpError = require("../models/error");

const produit = require("../models/produit-final");
const agriculteur = require("../models/agriculteur");

const { validationResult } = require("express-validator");

const nodemailer = require("nodemailer");

const log = console.log;
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "aydaghazouani43@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "ayda07993137", // TODO: your gmail password
  },
});

const ajout = async (req, res, next) => {
 

  const { nom, region, prix, description, quantite } = req.body;

  const createdProduit = new produit({
    nom,
    image: req.file.path,
    region,
    prix,
    quantite,
    description,
    finished: false,
  });

  try {
    createdProduit.save();
  } catch (err) {
    const error = new httpError("failed ", 500);
    return next(error);
  }

  res.status(201).json({
    produit: createdProduit,
  });
};

const getProduitFinal = async (req, res, next) => {
  let existingProduit;
  try {
    existingProduit = await produit.find();
  } catch (err) {
    const error = new httpError("failed", 500);
    return next(error);
  }

  res.json({ produit: existingProduit });
};

exports.ajout = ajout;
exports.getProduitFinal = getProduitFinal
