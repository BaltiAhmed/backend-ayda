const httpError = require("../models/error");
const message = require("../models/message");
const { validationResult } = require("express-validator");
const agriculteur = require("../models/agriculteur");
const client = require("../models/client");

const sendMessageClient = async (req, res, next) => {
  const { text, idSender, idRecever, IdAgriculteur } = req.body;

  const createdMessage = new message({
    text,
    idSender,
    idRecever,
  });

  let existingAgriculteur;

  try {
    existingAgriculteur = await client.findById(IdAgriculteur);
  } catch (err) {
    const error = new httpError("problem !!!!!", 500);
    return next(error);
  }

  console.log(existingAgriculteur);

  try {
    await createdMessage.save();
    existingAgriculteur.messages.push(createdMessage);
    existingAgriculteur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ message: createdMessage });
};

const sendMessage = async (req, res, next) => {
  const { text, idSender, idRecever, IdAgriculteur } = req.body;

  const createdMessage = new message({
    text,
    idSender,
    idRecever,
  });

  let existingAgriculteur;

  try {
    existingAgriculteur = await agriculteur.findById(IdAgriculteur);
  } catch (err) {
    const error = new httpError("problem !!!!!", 500);
    return next(error);
  }

  console.log(existingAgriculteur);

  try {
    await createdMessage.save();
    existingAgriculteur.messages.push(createdMessage);
    existingAgriculteur.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }

  res.status(201).json({ message: createdMessage });
};

/* const sendMessageParentParent = async (req, res, next) => {
  const { text, idSender, idRecever, parentId1, parentId2 } = req.body;
  const createdMessage = new message({
    text,
    idSender,
    idRecever,
  });
  let existinfParent1;
  try {
    existinfParent1 = await parent.findById(idSender);
  } catch (err) {
    const error = new httpError("problem !!!!!", 500);
    return next(error);
  }
   let existinfParent2;
  try {
    existinfParent2 = await parent.findById(idRecever);
  } catch (err) {
    const error = new httpError("problem !!!!!", 500);
    return next(error);
  }
  try {
    createdMessage.save();
    existinfParent1.messages.push(createdMessage);
    existinfParent1.save();
    existinfParent2.messages.push(createdMessage);
    await existinfParent2.save();
  } catch (err) {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.status(201).json({ message: createdMessage });
}; */

const getMessage = async (req, res, next) => {
  let existingMessage;
  try {
    existingMessage = await message.find({}, "-pasword");
  } catch {
    const error = new httpError("failed signup", 500);
    return next(error);
  }
  res.json({ existingMessage: existingMessage });
};

const getMessageByAgriculteurId = async (req, res, next) => {
  const id = req.params.id;

  let existingMessage;
  try {
    existingMessage = await agriculteur.findById(id).populate("messages");
  } catch (err) {
    const error = new httpError(
      "Fetching enfats failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingMessage || existingMessage.messages.length === 0) {
    return next(
      new httpError("Could not find child for the provided user id.", 404)
    );
  }

  res.json({
    messages: existingMessage.messages.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

const getMessageByClientId = async (req, res, next) => {
  const id = req.params.id;

  let existingMessage;
  try {
    existingMessage = await client.findById(id).populate("messages");
  } catch (err) {
    const error = new httpError(
      "Fetching enfats failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingMessage || existingMessage.messages.length === 0) {
    return next(
      new httpError("Could not find child for the provided user id.", 404)
    );
  }

  res.json({
    messages: existingMessage.messages.map((el) =>
      el.toObject({ getters: true })
    ),
  });
};

/* const getMessageByParentId = async (req, res, next) => {
  const id = req.params.id;
  let existingMessage;
  try {
    existingMessage = await parent.findById(id).populate("messages");
  } catch (err) {
    const error = new httpError(
      "Fetching enfats failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!existingMessage || existingMessage.messages.length === 0) {
    return next(
      new httpError("Could not find child for the provided user id.", 404)
    );
  }
  res.json({
    messages: existingMessage.messages.map((el) =>
      el.toObject({ getters: true })
    ),
  });
}; */

exports.sendMessage = sendMessage;
exports.sendMessageClient = sendMessageClient
exports.getMessage = getMessage;
exports.getMessageByAgriculteurId = getMessageByAgriculteurId;
exports.getMessageByClientId = getMessageByClientId;
