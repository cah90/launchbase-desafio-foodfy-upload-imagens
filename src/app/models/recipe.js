const db = require("../../config/db")
const {date} = require("../lib/utils")

module.exports = {
  all(callback) {
     db.query(`
     SELECT recipes.*, chefs.name, chefs.avatar_url
     FROM recipes
     INNER JOIN chefs
     ON recipes.chef_id = chefs.id
     `, (err, results) => {
      if(err) throw `Database Error! ${err}`
      callback(results.rows)
     })
  },

  create(data, callback) {
    const query = `
    INSERT INTO recipes (
      image,
      title,
      ingredients, 
      preparation,
      information,
      chef_id,
      created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `
    const values = [ 
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.chef,
      date(Date.now()).iso
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Database Error! ${err}`
      console.log(results.rows[0])
      return callback(results.rows[0])
    }) 
  },

  find(id, callback) {
    db.query(`
    SELECT recipes.*, chefs.name 
    FROM recipes
    INNER JOIN chefs
    ON recipes.chef_id = chefs.id
    WHERE recipes.id=$1
    `, [id], (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },

  update(data, callback) {
    const query = `
      UPDATE recipes SET
        image=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5),
        chef_id=($6)
      WHERE id=$7
      `
    const values = [
      data.image,
      data.title,
      data.ingredients,
      data.preparation,
      data.information,
      data.chef,
      data.id
    ]   
    
    db.query(query, values, (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback()
    })
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

  chefsSelectOptions(callback) {
    db.query(`
      SELECT name, id
      FROM chefs
    `, (err, results) => {
      if(err) throw `Database error! ${err}`

      return callback(results.rows)
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
