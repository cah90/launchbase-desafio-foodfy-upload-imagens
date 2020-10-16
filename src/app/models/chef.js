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

 async show(id) {
  const photoChef = await db.query(`
  SELECT 
    chefs.id, 
    chefs.name as chefname, 
    files.name as filename, 
    files.path, 
    files.src
  FROM chefs
  INNER JOIN files
  ON files.id = chefs.file_id
  WHERE chefs.id = $1
  `, [id])

  const recipes = await db.query(`
  SELECT *
  FROM recipes
  INNER JOIN recipe_files
  ON recipes.id = recipe_files.recipe_id
  INNER JOIN files
  ON recipe_files.file_id = files.id
  WHERE recipes.chef_id = $1
  `, [id])

  return {photoChef, recipes}

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

 hasRecipes(id) {
  return db.query(`
    SELECT recipes
    FROM recipes
    WHERE chef_id=$1
  `, [id])
 },

 delete(id) {
   return db.query(`
    DELETE 
    FROM chefs 
    WHERE id=$1
   `, [id])
 }
}