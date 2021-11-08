const httpError = require("../models/error");

const service = require("../models/service");
const agriculteur = require("../models/agriculteur");
const demandeService = require("../models/demande-service");

const { validationResult } = require("express-validator");

const twilio = require("twilio");

const nodemailer = require("nodemailer");

const log = console.log;
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL || "aydaghazouani43@gmail.com", // TODO: your gmail account
    pass: process.env.PASSWORD || "ayda07993137", // TODO: your gmail password
  },
});

const ajoutDemandeService = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { serviceId, agriculteurId, nbrJour, prix } = req.body;

  let existingService;
  try {
    existingService = await service.findById(serviceId);
  } catch {
    return next(new httpError("failed", 500));
  }

  let existingAgriculteur;
  try {
    existingAgriculteur = await agriculteur.findById(agriculteurId);
  } catch {
    return next(new httpError("failed !! ", 500));
  }

  console.log(serviceId, agriculteurId);

  const createdDemandeService = new demandeService({
    Service: existingService,
    Agriculteur: existingAgriculteur,
    nbrJour,
    prix,
    decision:"En court de traitement",
    finished: false,
  });

  try {
    createdDemandeService.save();
    existingAgriculteur.demandeServices.push(createdDemandeService);
    existingAgriculteur.save();
  } catch (err) {
    const error = new httpError("failed !!!!!!!!!! ", 500);
    return next(error);
  }

  res.status(201).json({
    demandeService: createdDemandeService,
  });
};

const getDemandeService = async (req, res, next) => {
  let existingDemandeService;
  try {
    existingDemandeService = await demandeService.find();
  } catch (err) {
    const error = new httpError("failed", 500);
    return next(error);
  }

  res.json({ demandeService: existingDemandeService });
};

const AcceptDemandeService = async (req, res, next) => {
  const { idAgriculteur, idService } = req.body;
  const id = req.params.id;

  let existingDemandeService;
  try {
    existingDemandeService = await demandeService.findById(id);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  existingDemandeService.finished = true;
  existingDemandeService.decision = "Demande acceptée";

  try {
    await existingDemandeService.save();
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

  let existingService;
  try {
    existingService = await service.findById(idService);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  let mailOptions = {
    from: "aydaghazouani43@gmail.com", // TODO: email sender
    to: existingAgriculteur.email, // TODO: email receiver
    subject: "Accept de demande de service",
    text:
      "votre demande de service  " +
      existingService.nom +
      " est acceptée veuillez nous consulter dans nos locaux pour finaliser les procédure.",
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ DemandeService: existingDemandeService });
};

const RefusDemandeService = async (req, res, next) => {
  const { idAgriculteur, idService } = req.body;
  const id = req.params.id;

  let existingDemandeService;
  try {
    existingDemandeService = await demandeService.findById(id);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  existingDemandeService.finished = true;
  existingDemandeService.decision = "Demande refusée";

  try {
    await existingDemandeService.save();
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

  let existingService;
  try {
    existingService = await service.findById(idService);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  let mailOptions = {
    from: "aydaghazouani43@gmail.com", // TODO: email sender
    to: existingAgriculteur.email, // TODO: email receiver
    subject: "Accept de demande de service",
    text:
      "votre demande de service  " +
      existingService.nom +
      " est refusée .",
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return log("Error occurs");
    }
    return log("Email sent!!!");
  });

  res.status(200).json({ DemandeService: existingDemandeService });
};

exports.ajoutDemandeService = ajoutDemandeService;
exports.getDemandeService = getDemandeService;
exports.AcceptDemandeService = AcceptDemandeService
exports.RefusDemandeService = RefusDemandeService
