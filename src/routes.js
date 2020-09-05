const express = require('express')
const routes = express.Router()
const chefs = require('./app/controllers/admin/chefs.js')
const recipes = require('./app/controllers/admin/recipes.js')
const main = require('./app/controllers/main.js')


module.exports = routes

routes.get("/", main.index) 
routes.get("/about", main.about)
routes.get("/chefs", main.chefs)
routes.get("/recipes", main.recipes)
routes.get("/recipes/:id", main.recipe)
routes.get("/results", main.results) 

// ADMINISTRATIVE AREA
//RECIPES
routes.get("/admin/recipes", recipes.index)
routes.get("/admin/recipes/create", recipes.create)
routes.get("/admin/recipes/:id", recipes.show)
routes.get("/admin/recipes/:id/edit", recipes.edit)
routes.post("/admin/recipes", recipes.post)
routes.put("/admin/recipes", recipes.put)
routes.delete("/admin/recipes", recipes.delete)

//CHEFS
routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)
routes.post("/admin/chefs", chefs.post)
routes.put("/admin/chefs", chefs.put)
routes.delete("/admin/chefs", chefs.delete)