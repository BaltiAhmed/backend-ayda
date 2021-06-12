const httpError = require("../models/error");

const agriculteur = require("../models/agriculteur");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, prenom, tel, adresse, email, password } = req.body;
  let existngAgriculteur;
  try {
    existngAgriculteur = await agriculteur.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existngAgriculteur) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createdAgriculteur = new agriculteur({
    nom,
    prenom,
    tel,
    adresse,
    email,
    password,
  });

  try {
    await createdAgriculteur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdAgriculteur.id, email: createdAgriculteur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res.status(201).json({
    agriculteur: createdAgriculteur.id,
    email: createdAgriculteur.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed", 422));
  }
  const { email, password } = req.body;
  let existngAgriculteur;
  try {
    existngAgriculteur = await agriculteur.findOne({ email: email });
  } catch {
    return next(new httpError("failed!!", 500));
  }
  console.log(existngAgriculteur)
  if (!existngAgriculteur || existngAgriculteur.password !== password) {
    return next(new httpError("invalid password", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existngAgriculteur.id, email: existngAgriculteur.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ agriculteur: existngAgriculteur, token: token });
};

exports.signup = signup;

exports.login = login;
