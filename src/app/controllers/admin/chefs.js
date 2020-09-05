const Chef = require('../../models/chef')

module.exports = {
  index(req, res) {
    Chef.all( (chefs) => {
      return res.render("admin/chefs/index", {chefs}) 
    })
  },

  create(req,res) {
    return res.render("admin/chefs/create")
  }, 

  post(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == "") {
        return res.send("Please fill all the gaps")
      }
    }

    Chef.create(req.body, (chef) => {
      return res.redirect(`/admin/chefs/${chef.id}`)
    })
  },

  show(req, res) {
    Chef.find(req.params.id, ({chef, recipes}) => {
      if(!chef) return res.status(404).send("Chef not found")
      return res.render("admin/chefs/show", {chef, recipes})
    })
  },

  edit(req, res) {
    Chef.find(req.params.id, ({chef}) => {
      if(!chef) return res.status(404).send("Chef not found")
      return res.render("admin/chefs/edit", {chef})
    })  
  },

  put(req,res) {
    const keys = Object.keys(req.body)
  
    for(key of keys) {
      if(req.body[key] === "")
        return res.send('Please, fill all the form.')
    }

    Chef.update(req.body, function() {
      return res.redirect(`/admin/chefs/${req.body.id}`)
    }) 
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