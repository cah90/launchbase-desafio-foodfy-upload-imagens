const Recipe = require("../../models/recipe")

module.exports = {
  index(req, res) {
    Recipe.all( (recipes) => {
      return res.render("admin/recipes/index", {recipes}) 
    })
  },

  create(req, res) { 
    Recipe.chefsSelectOptions( (chefs) => {
      return res.render("admin/recipes/create", {chefs})
    })
  },
  
  post(req, res) {
  
    const keys = Object.keys(req.body)
    keys.pop()

    for(key of keys) {
      if(req.body[key] == "") {
        return res.send("Please fill all the gaps")
      }
    }

    Recipe.create(req.body, (recipe) => {
      return res.redirect(`/admin/recipes/${recipe.id}`)
    })
  },
  
  show(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.send("Recipe not found")
      return res.render("admin/recipes/show", {recipe})
    })
  },
  
  edit(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.send("Recipe not found")
      
      Recipe.chefsSelectOptions( (chefs) => {
        return res.render("admin/recipes/edit", {recipe, chefs})
      })
    })
  },
  
  put(req, res) {
    Recipe.update(req.body, () => {
      return res.redirect(`/admin/recipes/${req.body.id}`)
    })
  },
  
  delete(req, res) {
    Recipe.delete(req.body.id, () => { 
      return res.redirect('/admin/recipes')
    })
    }
  }




