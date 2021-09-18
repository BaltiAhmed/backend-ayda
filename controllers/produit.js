const httpError = require("../models/error");

const produit = require("../models/produit");
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
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, region, prix, description, quantite, Agriculteur } = req.body;

  const createdProduit = new produit({
    nom,
    image: req.file.path,
    region,
    prix,
    quantite,
    description,
    Agriculteur,
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

const getDemandeProduit = async (req, res, next) => {
  let existingDemandeProduit;
  try {
    existingDemandeProduit = await produit.find();
  } catch (err) {
    const error = new httpError("failed", 500);
    return next(error);
  }

  res.json({ produit: existingDemandeProduit });
};

const AcceptDemandeProduit = async (req, res, next) => {
  const { idAgriculteur } = req.body;
  const id = req.params.id;

  let existingDemandeProduit;
  try {
    existingDemandeProduit = await produit.findById(id);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  existingDemandeProduit.finished = true;

  try {
    await existingDemandeProduit.save();
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.findById(idAgriculteur);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  let mailOptions = {
    from: "aydaghazouani43@gmail.com", // TODO: email sender
    to: existingAgriculteur.email, // TODO: email receiver
    subject: "Accept de demande de service",
    text:
      "votre demande de vente de produit  " +
      existingDemandeProduit.nom +
      " est acceptée veuillez nous consulter dans nos locaux pour finaliser les procédure.",
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ DemandeService: existingDemandeProduit });
};

exports.ajout = ajout;
exports.getDemandeProduit = getDemandeProduit;
exports.AcceptDemandeProduit = AcceptDemandeProduit;
