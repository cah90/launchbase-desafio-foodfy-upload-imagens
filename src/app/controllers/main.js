const Recipe = require("../models/recipe")

module.exports = {
  index(req, res) {
    Recipe.all( (recipes) => {
      return res.render("main/index", {recipes: recipes.slice(0,6)}) 
  })
  },
  
  about(req, res) {
    return res.render("main/about")
  },

  chefs(req, res) {
    Recipe.showChefs( ( chefs ) => {
      return res.render("main/chefs", {chefs})
    })
  },
  
  recipes(req, res) {
    Recipe.all( (recipes) => {
      return res.render("main/recipes", { recipes })
    })
  }, 
  
  recipe(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.status(400).send("Recipe not found")
      return res.render("main/recipe", {recipe})
    })
  },

  results(req, res) {
    Recipe.results( req.query.filter, (recipes ) => {
      const filter = req.query.filter
      return res.render("main/results", { recipes, filter })
    })
  }
}

 