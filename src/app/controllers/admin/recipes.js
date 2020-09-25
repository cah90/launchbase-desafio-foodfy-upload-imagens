const Recipe = require("../../models/recipe")
const File = require("../../models/file")
const RecipeFile = require("../../models/recipeFile")
const Chef = require("../../models/chef")

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
      return res.send('You need to have at least one image.')
    }

   const result = await Recipe.create(req.body)
   const recipeId = result.rows[0].id

   const filesPromise = req.files.map(file => File.create({
     ...file,
     src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
   })) //cada um retorna uma promessa e esse array de promessas passa para o promise.all

   const filesPromiseResults = await Promise.all(filesPromise) //espera todas as promessas serem executadas.

   const filesIdPromise = filesPromiseResults.map(item => {
    const fileId = item.rows[0].id

    return RecipeFile.create({
      file_id: fileId,
      recipe_id: recipeId
    })
  })

  const filesIdPromiseResult = await Promise.all(filesIdPromise)

  console.log('filesIdPromise', filesIdPromise)

   return res.redirect(`/admin/recipes/${recipeId}/edit`)
  },
  
  show(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.send("Recipe not found")
      return res.render("admin/recipes/show", {recipe})
    })
  },
  
  async edit(req, res) {
    const result = await Recipe.find(req.params.id) 
    //console.log('result', result)
    const recipe = result.rows[0]
    //console.log('recipe', recipe)
    
    if(!recipe) return res.send("Recipe not found")
      
    const chefs = await Chef.all() 
    //console.log('chefs', chefs.rows)
    
    const files = await File.find( req.params.id ) 
    
    return res.render("admin/recipes/edit", {recipe, files: files.rows, chefs: chefs.rows})

  },
  
  async put(req, res) {
    const keys = Object.keys(req.body)

    for (key in keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send('Please, fill all fields')
      }
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",") // [1,2,3,] Transforma a string em um array
      const lastIndex = removedFiles.length - 1 //We could have used .pop() on removedFiles.
      removedFiles.splice(lastIndex, 1) //[1,2,3]

      const removedFilesPromise = removedFiles.map( file => File.delete(id)) //id aqui é file, que por sua vez é um item do array que contém ids.

      await Promise.all(removedFilesPromise)
    }

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




