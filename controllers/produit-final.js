const httpError = require("../models/error");

const produit = require("../models/produit-final");
const agriculteur = require("../models/agriculteur");
const client = require("../models/client");
const commande = require("../models/commande");

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

const ajoutProduitPanier = async (req, res, next) => {
  const { idProduit, idClient, prix } = req.body;

  let existingArticle;

  try {
    existingArticle = await produit.findById(idProduit);
  } catch {
    return next(new httpError("failed article", 500));
  }

  let existingUser;

  try {
    existingUser = await client.findById(idClient);
  } catch {
    return next(new httpError("failed user", 500));
  }

  existingUser.prixT = parseInt(existingUser.prixT,10) + parseInt(prix,10);

  try {
    existingUser.paniers.push(existingArticle);
    existingUser.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ panier: existingUser.paniers });
};

const SuprimerProduitPanier = async (req, res, next) => {
  const { idProduit, idClient, prix } = req.body;

  let existingArticle;

  try {
    existingArticle = await produit.findById(idProduit);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingUser;

  try {
    existingUser = await client.findById(idClient);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingUser.prixT = existingUser.prixT - prix;

  console.log(existingArticle._id);

  try {
    const index = existingUser.paniers.indexOf(existingArticle._id);
    existingUser.paniers.splice(index, 1);
    console.log(existingUser);
    existingUser.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ client: existingUser });
};

const getProduitByPanier = async (req, res, next) => {
  const id = req.params.id;

  let existingProduit;
  try {
    existingProduit = await client.findById(id).populate("paniers");
  } catch (err) {
    const error = new httpError("Fetching failed", 500);
    return next(error);
  }

  if (!existingProduit || existingProduit.paniers.length === 0) {
    return next(new httpError("could not find article for this id.", 404));
  }

  res.json({
    existingProduit: existingProduit.paniers.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

const getProduitByCommande = async (req, res, next) => {
  const id = req.params.id;

  let existingProduit;
  try {
    existingProduit = await commande.findById(id).populate("produits");
  } catch (err) {
    const error = new httpError("Fetching failed", 500);
    return next(error);
  }

  if (!existingProduit || existingProduit.produits.length === 0) {
    return next(new httpError("could not find article for this id.", 404));
  }

  res.json({
    existingProduit: existingProduit.produits.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

const updateProduitFinal = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new httpError("Invalid inputs passed", 422));
  }

  const { nom, region, prix, description, quantite } = req.body;
  console.log(nom, region, prix, description, quantite)
  const id = req.params.id;

  let existingProduit;
  try {
    existingProduit = await produit.findById(id);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  existingProduit.nom = nom;
  existingProduit.region = region;
  existingProduit.prix = prix;
  existingProduit.description = description;
  existingProduit.quantite = quantite;
  existingProduit.image = req.file.path;

  try {
    await existingProduit.save();
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ produit: existingProduit });
};

exports.ajout = ajout;
exports.getProduitFinal = getProduitFinal;
exports.getProduitFinalById = getProduitFinalById;
exports.rating = rating;
exports.deleteProduit = deleteProduit;
exports.ajoutProduitPanier = ajoutProduitPanier;
exports.SuprimerProduitPanier = SuprimerProduitPanier;
exports.getProduitByPanier = getProduitByPanier;
exports.getProduitByCommande =getProduitByCommande
exports.updateProduitFinal = updateProduitFinal
