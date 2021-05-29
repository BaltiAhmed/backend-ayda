const httpError = require("../models/error");

const service = require("../models/service");

const { validationResult } = require("express-validator");

const ajout = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, type, prix, description } = req.body;

  const createdService = new service({
    nom,
    type,
    prix,
    description,
  });

  try {
    await createdService.save();
  } catch (err) {
    const error = new httpError("failed ", 500);
    return next(error);
  }

  res.status(201).json({
    service: createdService,
  });
};

const getService = async (req, res, next) => {
  let existingService;
  try {
    existingService = await service.find();
  } catch (err) {
    const error = new httpError("failed", 500);
    return next(error);
  }

  res.json({ service: existingService });
};

const updateService = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new httpError("Invalid inputs passed", 422));
  }

  const { nom, type, prix, description } = req.body;
  const id = req.params.id;

  let existingService;
  try {
    existingService = await service.findById(id);
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  existingService.nom = nom;
  existingService.type = type;
  existingService.prix = prix;
  existingService.description = description;

  try {
    await existingService.save();
  } catch (err) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  res.status(200).json({ service: existingService });
};

const deleteService = async (req, res, next) => {
  const id = req.params.id;
  let existingService;
  try {
    existingService = await service.findById(id);
  } catch {
    return next(new httpError("failed", 500));
  }

  if (!existingService) {
    return next(new httpError("service does not exist", 500));
  }
  try {
    existingService.remove();
  } catch {
    return next(new httpError("failed", 500));
  }
  res.status(200).json({ message: "deleted" });
};

exports.ajout = ajout;
exports.getService= getService
exports.updateService = updateService
exports.deleteService = deleteService
