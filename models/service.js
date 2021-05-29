const mongoose = require("mongoose");
const schema = mongoose.Schema;

const serviceSchema = new schema({
  nom: { type: String, required: true },
  type: { type: String, required: true },
  prix: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("service", serviceSchema);
