const express = require("express");
const route = express.Router();

const serviceControllers = require("../controllers/service");

const { check } = require("express-validator");

route.post(
  "/ajout",
  check("nom").not().isEmpty(),
  check("type").not().isEmpty(),
  check("prix").not().isEmpty(),
  check("description").not().isEmpty(),
  serviceControllers.ajout
);

route.patch(
  "/:id",
  check("nom").not().isEmpty(),
  check("type").not().isEmpty(),
  check("prix").not().isEmpty(),
  check("description").not().isEmpty(),
  serviceControllers.updateService
);

route.get("/", serviceControllers.getService);
route.delete("/:id", serviceControllers.deleteService);
route.get("/:id", serviceControllers.getServiceById);

module.exports = route;
