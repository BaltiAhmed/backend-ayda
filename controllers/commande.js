const httpError = require("../models/error");

const client = require("../models/client");
const commande = require("../models/commande");

const { validationResult } = require("express-validator");
const produitFinal = require("../models/produit-final");

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

const ValiderCommande = async (req, res, next) => {
  const { idClient } = req.body;
  const id = req.params.id;
  let existingCommande;

  try {
    existingCommande = await commande.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingClient;

  try {
    existingClient = await client.findById(idClient);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingCommande.statut = "Valider";

  try {
    existingCommande.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  let mailOptions = {
    from: "aydaghazouani43@gmail.com", // TODO: email sender
    to: existingClient.email, // TODO: email receiver
    subject: "Accept de demande de service",
    text:
      "votre Commande de date " +
      existingCommande.date +
      " est valider vous pouver la récupérer dans nos locaux.",
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ commande: existingCommande });
};

const annulerCommande = async (req, res, next) => {
  const { idClient } = req.body;
  const id = req.params.id;
  let existingCommande;

  try {
    existingCommande = await commande.findById(id);
  } catch {
    return next(new httpError("failed ", 500));
  }

  let existingClient;

  try {
    existingClient = await client.findById(idClient);
  } catch {
    return next(new httpError("failed ", 500));
  }

  existingCommande.statut = "Annuler";

  try {
    existingCommande.save();
  } catch {
    return next(new httpError("failed to save ", 500));
  }

  let mailOptions = {
    from: "aydaghazouani43@gmail.com", // TODO: email sender
    to: existingClient.email, // TODO: email receiver
    subject: "Accept de demande de service",
    text: "votre Commande de date " + existingCommande.date + " est Annuler",
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ commande: existingCommande });
};

const getCommandeByClient = async (req, res, next) => {
  const id = req.params.id;

  let existingCommande;
  try {
    existingCommande = await client.findById(id).populate("commandes");
  } catch (err) {
    const error = new httpError("Fetching failed", 500);
    return next(error);
  }

  if (!existingCommande || existingCommande.commandes.length === 0) {
    return next(new httpError("could not find article for this id.", 404));
  }

  res.json({
    existingCommande: existingCommande.commandes.map((item) =>
      item.toObject({ getters: true })
    ),
  });
};

exports.ajout = ajout;
exports.getCommande = getCommande;
exports.getCommandeById = getCommandeById;
exports.ajoutArticleToCommande = ajoutArticleToCommande;
exports.ValiderCommande = ValiderCommande;
exports.annulerCommande = annulerCommande;
exports.getCommandeByClient = getCommandeByClient
