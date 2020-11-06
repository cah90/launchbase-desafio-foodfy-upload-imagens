const Recipe = require("../models/recipe")
const {removeDuplicateRecipes} = require("../lib/utils")

module.exports = {
  async index(req, res) {
    let recipes = await Recipe.all()
    recipes = recipes.rows

    const filteredRows = removeDuplicateRecipes(recipes)
    
    return res.render("main/index", {recipes: filteredRows.slice(0,6)}) 
  },
  
  about(req, res) {
    return res.render("main/about")
  },

  async chefs(req, res) {
    const chefs = await Recipe.showChefs()

    return res.render("main/chefs", {chefs: chefs.rows}) 
  },
  
  async recipes(req, res) {
    let recipes = await Recipe.all()
    recipes = recipes.rows

    const filteredRows = removeDuplicateRecipes(recipes)

    return res.render("main/recipes", { recipes: filteredRows }) 
  }, 
  
  async recipe(req, res) {
    const recipe = await Recipe.find(req.params.id)

    if(!recipe) return res.status(400).send("Recipe not found")

    return res.render("main/recipe", {recipe: recipe.rows[0]}) 
  },

  async results(req, res) {
    let recipes = await Recipe.results(req.query.filter)
    recipes = recipes.rows

    const filter = req.query.filter

    const filteredRows = removeDuplicateRecipes(recipes)

    return res.render("main/results", { recipes: filteredRows, filter }) 
  }
}
 
 