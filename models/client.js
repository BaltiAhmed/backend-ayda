const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const clientSchema = new schema({
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    tel:{type:String,required:true},
    adresse:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    prixT:{type:Number,required:true},
    paniers:[{type:mongoose.Types.ObjectId,required:true,ref:'produitFinal'}],
    commandes:[{type:mongoose.Types.ObjectId,required:true,ref:'commande'}],
    messages:[{type:mongoose.Types.ObjectId,required:true,ref:'message'}]

    
})

clientSchema.plugin(uniqueValidator)

module.exports = mongoose.model('client',clientSchema)