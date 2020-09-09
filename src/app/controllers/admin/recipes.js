const Recipe = require("../../models/recipe")
const File = require("../../models/file")

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
  
  async post(req, res) {
    const keys = Object.keys(req.body) //return an array with the keys of the object.
    keys.pop()

    for(key of keys) {
      if(req.body[key] == "") {
        return res.send("Please fill all the fields")
      }
    }

    if(req.files.length == 0) {
      return res.send('Please, send at least one image')
    }

   const result = await Recipe.create(req.body)
   const recipeId = result.rows[0].id

   const filesPromise = req.files.map(file => File.create({
     ...file,
     recipe_id: recipeId
   }))

   await Promise.all(filesPromise)

  return res.redirect(`/admin/recipes/${recipeId}`)
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




