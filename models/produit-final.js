const mongoose = require("mongoose");
const schema = mongoose.Schema;

const produitFinalScema = new schema({
  nom: { type: String, required: true },
  image: { type: String, required: true },
  region: { type: String, required: true },
  prix: { type: String, required: true },
  quantite: { type: Number, required: true },
  categorie: { type: String, required: true },
  description: { type: String, required: true },
  scoreT: { type: Number, required: true },
  NRating: { type: Number, required: true },
  TRating: { type: Number, required: true },
  finished: { type: Boolean, required: true },
});

module.exports = mongoose.model("produitFinal", produitFinalScema);
