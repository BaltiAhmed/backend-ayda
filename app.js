const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const httperror = require("./models/error");

const mongoose = require("mongoose");

const path = require("path");

const responsableRoute = require("./routes/responsable");
const serviceRoute = require("./routes/service");
const agriculteurRoutes = require("./routes/agriculteur");
const clientRoutes = require("./routes/client");
const produitRoute = require("./routes/produit");
const demandeServiceRoutes = require("./routes/demande-service");
const produitFinalRoute = require("./routes/produit-final");

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/responsable", responsableRoute);
app.use("/api/service", serviceRoute);
app.use("/api/agriculteur", agriculteurRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/produit", produitRoute);
app.use("/api/demandeService", demandeServiceRoutes);
app.use("/api/produitfinal", produitFinalRoute);

app.use((req, res, next) => {
  const error = new httperror("could not find that page", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "an unknown error occurred " });
});

mongoose
  .connect(
    "mongodb+srv://aydapfe2021:ayda@cluster0.nghom.mongodb.net/ayda?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
