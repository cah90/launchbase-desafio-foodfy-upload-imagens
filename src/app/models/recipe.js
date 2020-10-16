const db = require("../../config/db")
const {date} = require("../lib/utils")

module.exports = {
  all() {
     return db.query (`
     SELECT recipes.*, chefs.name
     FROM recipes
     INNER JOIN chefs
     ON recipes.chef_id = chefs.id
     `)
  },

  create(data) {
    const query = `
    INSERT INTO recipes (
      title,
      ingredients, 
      preparation,
      information,
      chef_id,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
    `
    const values = [ 
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.chef,
      date(Date.now()).iso
    ]

    return db.query(query, values) 

  },

  find(id) {

    console.log('i am the id on recipe.find', id)

   const query = `
    SELECT recipes.*, chefs.name 
    FROM recipes
    INNER JOIN chefs
    ON recipes.chef_id = chefs.id
    WHERE recipes.id=$1
    `

    return db.query(query, [id])
  },

  update(data) {

    console.log('im the recipe.update', data)

    const query = `
      UPDATE recipes SET
        title=($1),
        ingredients=($2),
        preparation=($3),
        information=($4),
        chef_id=($5)
      WHERE id=$6
      `
    const values = [
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.chef,
      data.id
    ]   
    
    return db.query(query, values)
  },

  delete(id, callback) {
    db.query(`
    DELETE FROM recipes
    WHERE id=$1
    `, [id], (err, results) => {
      if(err) throw `Database Error! ${err}`

      return callback()
    })
  },

  showChefs(callback) {
    db.query(`
    SELECT chefs.*, count(recipes) as total_recipes
    FROM recipes
    LEFT JOIN chefs 
    ON recipes.chef_id = chefs.id
    GROUP BY chefs.id
    `, (err, results) => {
      if(err) throw `Database Error! ${err}`
      callback(results.rows)
    })
  },

  results(filter, callback) {
    const values = [`%${filter}%`]
    db.query(`
    SELECT r.title, r.image, r.id, c.name
    FROM recipes r
    LEFT JOIN chefs c
    ON c.id = r.chef_id
    WHERE r.title ILIKE $1 
    `, values, function( err, results ) {
      if(err) throw `Database Error! ${err}`
      return callback(results.rows)
    })
  }
} 
