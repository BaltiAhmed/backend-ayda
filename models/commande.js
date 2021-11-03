const mongoose =require("mongoose")
const schema = mongoose.Schema;

const commandeSchema = new schema({
    idClient:{type:String,required:true},
    date:{type:String,required:true},
    prix:{type:String,required:true},
    livraison:{type:String,required:true},
    payement:{type:String,required:true},
    adresse:{type:String,required:true},
    gouvernerat:{type:String,required:true},
    statut:{type:String,required:true},
    produits:[{type:mongoose.Types.ObjectId,required:true,ref:'produitFinal'}]


})


module.exports = mongoose.model('commande',commandeSchema)