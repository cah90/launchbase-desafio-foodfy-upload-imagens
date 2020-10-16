const Recipe = require("../models/recipe")

module.exports = {
  async index(req, res) {
    const recipes = await Recipe.all()

    return res.render("main/index", {recipes: recipes.slice(0,6)}) 
  },
  
  about(req, res) {
    return res.render("main/about")
  },

  async chefs(req, res) {
    const chefs = await Recipe.showChefs()

    return res.render("main/chefs", {chefs})
  },
  
  async recipes(req, res) {
    const recipes = await Recipe.all()

    return res.render("main/recipes", { recipes })
  }, 
  
  async recipe(req, res) {
    const recipe = await Recipe.find(req.params.id)

    if(!recipe) return res.status(400).send("Recipe not found")

    return res.render("main/recipe", {recipe})
  },

  async results(req, res) {
    const recipes = await Recipe.results(req.query.filter)

    const filter = req.query.filter

    return res.render("main/results", { recipes, filter })
  }
}

 