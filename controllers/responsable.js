const httpError = require("../models/error");

const responsable = require("../models/responsable");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, prenom, tel, adresse, email, password } = req.body;
  let existingResponsable;
  try {
    existingResponsable = await responsable.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existingResponsable) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createdResponsable = new responsable({
    nom,
    prenom,
    tel,
    adresse,
    email,
    password,
  });

  try {
    await createdResponsable.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdResponsable.id, email: createdResponsable.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res.status(201).json({
    responsable: createdResponsable.id,
    email: createdResponsable.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed", 422));
  }
  const { email, password } = req.body;
  let existingResponsable;
  try {
    existingResponsable = await responsable.findOne({ email: email });
  } catch {
    return next(new httpError("failed!!", 500));
  }
  if (!existingResponsable || existingResponsable.password !== password) {
    return next(new httpError("invalid input passed", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingResponsable.id, email: existingResponsable.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ responsable: existingResponsable, token: token });
};

exports.signup = signup;

exports.login = login;
