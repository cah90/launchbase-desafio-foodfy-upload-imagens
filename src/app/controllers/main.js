const Recipe = require("../models/recipe")
const {removeDuplicateRecipes} = require("../lib/utils")

module.exports = {
  async index(req, res) {
    let recipes;

    try {
      recipes = await Recipe.all()
    } catch (err) {
      console.log(err.message)
    }
    
    recipes = recipes.rows

    const filteredRows = removeDuplicateRecipes(recipes)

    return res.render("main/index", {recipes: filteredRows.slice(0,6)}) 
  },
  
  about(req, res) {
    return res.render("main/about")
  },

  async chefs(req, res) {
    let chefs;

    try {
      chefs = await Recipe.showChefs() 
    } catch (err) {
      console.log(err.message)
    }
    
    return res.render("main/chefs", {chefs: chefs.rows}) 
  },
  
  async recipes(req, res) {
    let recipes; 

    try {
      recipes = await Recipe.all()
    } catch(err) {
      console.log(err.message)
    }

    recipes = recipes.rows

    const filteredRows = removeDuplicateRecipes(recipes)

    return res.render("main/recipes", { recipes: filteredRows }) 
  }, 
  
  async recipe(req, res) {
    let recipe;

    try {
      recipe = await Recipe.find(req.params.id)
    } catch (err) {
      console.log(err.message)
    }

    if(!recipe) return res.status(400).send("Recipe not found")

    return res.render("main/recipe", {recipe: recipe.rows[0], files: recipe.rows}) 
  },

  async results(req, res) {
    let recipes;
    try {
      recipes = await Recipe.results(req.query.filter)
    } catch(err) {
      console.log(err.message)
    }
    
    recipes = recipes.rows

    const filter = req.query.filter

    const filteredRows = removeDuplicateRecipes(recipes)

    return res.render("main/results", { recipes: filteredRows, filter }) 
  }
}
 
 