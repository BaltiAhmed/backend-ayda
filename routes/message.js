const express = require("express");
const route = express.Router();
const { check } = require("express-validator");
const messageControllers = require("../controllers/message");

route.post("/ajout", messageControllers.sendMessage);
route.post("/ajoutClient", messageControllers.sendMessageClient);
route.get('/',messageControllers.getMessage)
route.get('/agriculteur/:id',messageControllers.getMessageByAgriculteurId)
route.get('/client/:id',messageControllers.getMessageByClientId)


module.exports = route;