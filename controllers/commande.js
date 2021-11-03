const httpError = require("../models/error");

const client = require("../models/client");
const commande = require("../models/commande");

const { validationResult } = require("express-validator");
const produitFinal = require("../models/produit-final");

const ajout = async (req, res, next) => {
  const { idClient, prix, livraison, payement, frais, adresse, gouvernerat } =
    req.body;

  const d = new Date();
  console.log(idClient, prix, adresse, gouvernerat);

  const createdCommande = new commande({
    idClient,
    date:
      d.getDay() +
      "/" +
      d.getMonth() +
      "/" +
      d.getFullYear() +
      "-" +
      d.getHours() +
      ":" +
      d.getMinutes(),
    prix: prix + frais,
    livraison,
    payement,
    adresse,
    gouvernerat,
    statut: "En cours de préparation",
    produits: [],
  });

  let existinguser;
  try {
    existinguser = await client.findById(idClient);
  } catch (err) {
    const error = new httpError("failed !!!!, 500");
    return next(error);
  }

  try {
    await createdCommande.save();
    existinguser.commandes.push(createdCommande);
    existinguser.save();
  } catch (err) {
    const error = new httpError("failed signup!!!!!!!!!!!!!!!!!!!!!!!", 500);
    return next(error);
  }

  res.status(201).json({ Commande: createdCommande });
};

const getCommande = async (req, res, next) => {
  let existingCommande;
  try {
    existingCommande = await commande.find();
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ Commande: existingCommande });
};

const getCommandeById = async (req, res, next) => {
  const id = req.params.id;
  let existingCommande;
  try {
    existingCommande = await commande.findById(id);
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ Commande: existingCommande });
};

const ajoutArticleToCommande = async (req, res, next) => {
  const { idArticle } = req.body;
  const id = req.params.id;
  let existingCommande;

  try {
    existingCommande = await commande.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingArticle;

  try {
    existingArticle = await produitFinal.findById(idArticle);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingCommande.produits.push(existingArticle);

  try {
    existingCommande.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  res.status(200).json({ commande: existingCommande });
};

exports.ajout = ajout;
exports.getCommande = getCommande;
exports.getCommandeById = getCommandeById;
exports.ajoutArticleToCommande = ajoutArticleToCommande;
