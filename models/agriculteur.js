const mongoose =require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const schema = mongoose.Schema;

const agriculteurSchema = new schema({
    nom:{type:String,required:true},
    prenom:{type:String,required:true},
    tel:{type:String,required:true},
    adresse:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlenght:8},
    demandeServices:[{type:mongoose.Types.ObjectId,required:true,ref:'DemandeService'}],
    messages:[{type:mongoose.Types.ObjectId,required:true,ref:'message'}]

})

agriculteurSchema.plugin(uniqueValidator)

module.exports = mongoose.model('agriculteur',agriculteurSchema)