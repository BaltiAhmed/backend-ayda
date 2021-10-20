const httpError = require("../models/error");

const produit = require("../models/produit-final");
const agriculteur = require("../models/agriculteur");

const { validationResult } = require("express-validator");

const nodemailer = require("nodemailer");
const produitFinal = require("../models/produit-final");

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
    scoreT: 0,
    NRating: 0,
    TRating: 0,
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

const getProduitFinalById = async (req, res, next) => {
  const id = req.params.id;
  let existingProduit;
  try {
    existingProduit = await produit.findById(id);
  } catch (err) {
    const error = new httpError("failed", 500);
    return next(error);
  }

  res.json({ produit: existingProduit });
};

const rating = async (req, res, next) => {
  const { rating } = req.body;
  const id = req.params.id;

  let existingProduit;

  try {
    existingProduit = await produitFinal.findById(id);
  } catch {
    return next(new httpError("failed !! ", 500));
  }

  existingProduit.NRating = existingProduit.NRating + 1;
  existingProduit.TRating = existingProduit.TRating + rating;

  existingProduit.scoreT = existingProduit.TRating / existingProduit.NRating;

  try {
    existingProduit.save();
  } catch {
    return next(new httpError("failed to save !! ", 500));
  }

  res.status(200).json({ produit: existingProduit });
};

const deleteProduit = async (req, res, next) => {
  const id = req.params.id;
  let existingProduit;
  try {
    existingProduit = await produitFinal.findById(id);
  } catch {
    return next(new httpError("failed", 500));
  }

  if (!existingProduit) {
    return next(new httpError("existingProduit does not exist", 500));
  }
  try {
    existingProduit.remove();
  } catch {
    return next(new httpError("failed", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.ajout = ajout;
exports.getProduitFinal = getProduitFinal;
exports.getProduitFinalById = getProduitFinalById;
exports.rating = rating;
exports.deleteProduit = deleteProduit;
