const db = require("../../config/db")
const {date} = require("../lib/utils")

module.exports = {
 all() {
    const query = `
    SELECT * 
    FROM chefs
    ORDER BY name ASC`
    
    return db.query(query)
 },

 create(data) { 
  const query = `
  INSERT INTO chefs (
    name,
    created_at,
    file_id
  ) VALUES ($1, $2, $3)
  RETURNING id
  `
  const values = [
    data.name,
    date(Date.now()).iso,
    data.imageId
  ]

  return db.query(query, values) 
},

 find(id) {
  return db.query(`
    SELECT chefs.name as name, chefs.id as id, files.src as src, files.id as file_id
    FROM chefs 
    INNER JOIN files ON files.id = chefs.file_id
    WHERE chefs.id = $1
  `, [id])

}, 

 show(id) {

  const chef = db.query(`
  SELECT *
  FROM chefs
  WHERE chefs.id = $1
`, [id])

const recipes = db.query(`
  SELECT *
  FROM recipes
  WHERE recipes.chef_id = $1
`, [id])

  return {chef, recipes} 
 },

 update(data) {
   const query = `
   UPDATE chefs SET
    name=$1
    WHERE id=$2
   `
   const values = [
     data.name,
     data.id
   ]

   return db.query(query, values)
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