const db = require("../../config/db")
const {date} = require("../lib/utils")

module.exports = {
 all() {
    const query = `
    SELECT 
    chefs.id AS chef_id,
    chefs.name AS chef_name,
    files.name AS file_name,
    files.path AS file_path,
    files.src AS file_src,
    count(recipes.id) AS total_recipes
    FROM chefs
    LEFT JOIN files ON chefs.file_id = files.id
    LEFT JOIN recipes ON chefs.id = recipes.chef_id 
    GROUP BY chefs.id, files.name, files.path, files.src`
        
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
    SELECT 
      chefs.name AS chef_name, 
      chefs.id AS chef_id, 
      files.src AS file_src, 
      files.id AS file_id
    FROM chefs 
    INNER JOIN files ON files.id = chefs.file_id
    WHERE chefs.id = $1
  `, [id])

}, 

 async show(id) {
  const photoChef = await db.query(`
  SELECT 
    chefs.id AS chef_id, 
    chefs.name AS chef_name, 
    files.name AS file_name, 
    files.path AS file_path, 
    files.src AS file_src
  FROM chefs
  INNER JOIN files
  ON files.id = chefs.file_id
  WHERE chefs.id = $1
  `, [id])

  const recipes = await db.query(`
  SELECT 
    recipes.id AS recipe_id,
    recipes.title AS recipe_title,
    files.name AS recipe_name,
    files.src AS recipe_src
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