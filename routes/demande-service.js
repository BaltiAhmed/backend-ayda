const express = require("express");
const route = express.Router();

const demandeServiceControllers = require("../controllers/demande-service");

const { check } = require("express-validator");

route.post(
  "/ajoutDemandeService",
  demandeServiceControllers.ajoutDemandeService
);

route.get('/',demandeServiceControllers.getDemandeService)
route.patch('/:id',demandeServiceControllers.AcceptDemandeService)
route.patch('/refus/:id',demandeServiceControllers.RefusDemandeService)

module.exports = route;
