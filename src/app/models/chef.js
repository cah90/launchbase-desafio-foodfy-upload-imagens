const db = require("../../config/db")
const {date} = require("../lib/utils")

module.exports = {
 all(callback) {
    db.query(`
    SELECT * 
    FROM chefs
    ORDER BY name ASC`, (err, results) => {
     if(err) throw `Database Error! ${err}`
     callback(results.rows)
    })
 },

 create(data, callback) { 
  const query = `
  INSERT INTO chefs (
    avatar_url,
    name,
    created_at
  ) VALUES ($1, $2, $3)
  RETURNING id
  `
  const values = [
    data.avatar_url,
    data.name,
    date(Date.now()).iso
  ]

  db.query(query, values, (err, results) => {
    if(err) throw `Database Error! ${err}`
    callback(results.rows[0])
  }) 
},

 find(id, callback) {
 let chef, recipes
  db.query(`
    SELECT *
    FROM chefs
    WHERE chefs.id = $1
  `, [id], (err, results) => {
    if(err) throw `Database Error! ${err}`
    chef = results.rows[0]

  db.query(`
    SELECT *
    FROM recipes
    WHERE recipes.chef_id = $1
  `, [id], (err, results) => {
    if(err) throw `Database Error! ${err}`
    recipes = results.rows

    callback({chef, recipes})
    })
  }) 
 }, 

 update(data, callback) {
   const query = `
   UPDATE chefs SET
    avatar_url=($1),
    name=($2)
   WHERE id=$3 
   `
   const values = [
     data.avatar_url,
     data.name,
     data.id
   ]

   db.query(query, values, function(err, results) {
     if(err) throw `Database Error. ${err}`
     callback()
   })
 },

 check(id, callback) {
  db.query(`
    SELECT recipes
    FROM recipes
    WHERE chef_id=$1
  `, [id], function(err, results) {
    if(err) throw `Database Error. ${err}`

    return callback(results.rows)
  })
 },

 delete(id, callback) {
   db.query(`
    DELETE 
    FROM chefs 
    WHERE id=$1
   `, [id], function(err, results) {
     if(err) throw `Database Error. ${err}`

     return callback()
   })
 }
}