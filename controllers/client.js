const httpError = require("../models/error");

const client = require("../models/client");

const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed ", 422));
  }

  const { nom, prenom, tel, adresse, email, password } = req.body;
  let existingClient;
  try {
    existingClient = await client.findOne({ email: email });
  } catch (err) {
    const error = new httpError("problems!!!", 500);
    return next(error);
  }

  if (existingClient) {
    const error = new httpError("user exist", 422);
    return next(error);
  }

  const createdClient = new client({
    nom,
    prenom,
    tel,
    adresse,
    email,
    password,
    prixT: 0,
    paniers: [],
  });

  try {
    createdClient.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdClient.id, email: createdClient.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }

  res.status(201).json({
    client: createdClient.id,
    email: createdClient.email,
    token: token,
  });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new httpError("invalid input passed", 422));
  }
  const { email, password } = req.body;
  let existingClient;
  try {
    existingClient = await client.findOne({ email: email });
  } catch {
    return next(new httpError("failed!!", 500));
  }
  if (!existingClient || existingClient.password !== password) {
    return next(new httpError("invalid password", 422));
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingClient.id, email: existingClient.email },
      "secret-thinks",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new httpError("failed signup try again later", 500);
    return next(error);
  }
  res.status(200).json({ client: existingClient, token: token });
};

const getClient = async (req, res, next) => {
  let existingClient;
  try {
    existingClient = await client.find();
  } catch (err) {
    const error = new httpError("failed", 500);
    return next(error);
  }

  res.json({ client: existingClient });
};

const getClientById = async (req, res, next) => {
  const id = req.params.id;
  let existingClient;
  try {
    existingClient = await client.findById(id);
  } catch (err) {
    const error = new httpError("failed", 500);
    return next(error);
  }

  res.json({ client: existingClient });
};

exports.signup = signup;

exports.login = login;

exports.getClient = getClient;

exports.getClientById = getClientById
