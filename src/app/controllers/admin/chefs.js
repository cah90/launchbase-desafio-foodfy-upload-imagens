const Chef = require('../../models/chef')
const File = require('../../models/file')

module.exports = {
  index(req, res) {
    Chef.all( (chefs) => {
      return res.render("admin/chefs/index", {chefs}) 
    })
  },

  create(req,res) {
    return res.render("admin/chefs/create")
  }, 

  async post(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") {
        return res.send("Please fill all the gaps")
      }
    }

    const image = req.files[0]

    image.src = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`

    const imageFile = await File.create(image)  
    const imageId = imageFile.rows[0].id

    const chefData = {
      ...req.body,
      imageId
    }

    const chef = await Chef.create(chefData)
    console.log(chef.rows[0].id)

    return res.redirect(`/admin/chefs/${chef.rows[0].id}`)
  },

  show(req, res) {
    Chef.show(req.params.id, ({chef, recipes}) => {
      if(!chef) return res.status(404).send("Chef not found")
      return res.render("admin/chefs/show", {chef, recipes})
    })
  },

  async edit(req, res) {

    const chef = await Chef.find(req.params.id)  
    console.log('chef', chef)

    return res.render("admin/chefs/edit", {chef: chef.rows[0]})
  },

  async put(req,res) {
    const keys = Object.keys(req.body)
  
    for(key of keys) {
      if(req.body[key] === "")
        return res.send('Please, fill all the form.')
    }

    const chefResults = await Chef.find(req.body.id)
    const currentChef = chefResults.rows[0]

    const image = req.files[0] 

    image.src = `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
    image.id = currentChef.file_id

    const imageFile = await File.update(image)

    const chef = await Chef.update(req.body)

    return res.redirect(`/admin/chefs/${req.body.id}`)
  },

  delete(req, res) {
    Chef.check(req.body.id, function(recipes) {
      console.log(recipes) 
      if(recipes.length > 0) {
        return res.send("This chef can't be deleted because it owns recipes")
      } else {
        Chef.delete(req.body.id, function() {
          return res.redirect('/admin/chefs')
        })
      }
    }) 
  }
}