const express = require('express');
const route = express.Router();

const commandeControllers = require('../controllers/commande')




route.post('/ajout', commandeControllers.ajout)
route.get('/',commandeControllers.getCommande)
route.get('/:id',commandeControllers.getCommandeById)
route.post('/article/:id',commandeControllers.ajoutArticleToCommande)



module.exports = route