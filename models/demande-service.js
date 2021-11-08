const mongoose = require("mongoose");
const schema = mongoose.Schema;

const demandeServiceSchema = new schema({
  Service: { type: mongoose.Types.ObjectId, ref: "service" },
  Agriculteur: { type: mongoose.Types.ObjectId,  ref: "agriculteur" },
  nbrJour:{type:Number,required:true},
  prix:{type:Number,required:true},
  decision:{type:String,required:true},
  finished:{type:Boolean,required:true}
});

module.exports = mongoose.model("DemandeService", demandeServiceSchema);
