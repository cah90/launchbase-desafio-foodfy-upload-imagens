const db = require("../../config/db")
const {date} = require("../lib/utils")

module.exports = {
  all() {
     return db.query (`
     SELECT 
      recipes.id as recipe_id,
      recipes.title as recipe_title,
      recipes.ingredients as recipe_ingredients,
      recipes.preparation as recipe_preparation,
      recipes.information as recipe_information,
      files.id as file_id,
      files.path as file_path,
      files.src as file_src, 
      chefs.name as chef_name
     FROM recipes
     INNER JOIN chefs
     ON recipes.chef_id = chefs.id
     INNER JOIN recipe_files
     ON recipes.id = recipe_files.recipe_id
     INNER JOIN files
     ON recipe_files.file_id = files.id
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
    return db.query(`
    SELECT 
      recipes.id as recipe_id,
      recipes.title as recipe_title,
      recipes.ingredients as recipe_ingredients,
      recipes.preparation as recipe_preparation,
      recipes.information as recipe_information,
      files.id as file_id,
      files.path as file_path,
      files.src as file_src, 
      chefs.name as chef_name
     FROM recipes
     INNER JOIN chefs
     ON recipes.chef_id = chefs.id
     INNER JOIN recipe_files
     ON recipes.id = recipe_files.recipe_id
     INNER JOIN files
     ON recipe_files.file_id = files.id
    WHERE recipes.id=$1
    `, [id])
  },

  update(data) {

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

  delete(id) {
    return db.query(`
    DELETE FROM recipes
    WHERE id=$1
    `, [id])
  },

  showChefs() {
    return db.query(`
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
    GROUP BY chefs.id, files.name, files.path, files.src
    `)
  },

  recipe(id) {
    return db.query(`
    SELECT *
    FROM recipes
    WHERE recipes.id = $1
    `, [id])
  },

  results(filter) {
    const values = [`%${filter}%`]
    return db.query(`
    SELECT 
      recipes.title AS recipe_title,
      recipes.id AS recipe_id,
      chefs.name AS chef_name,
      files.name AS file_name,
      files.src AS file_src
    FROM recipes
    INNER JOIN chefs ON recipes.chef_id = chefs.id
    INNER JOIN recipe_files ON recipe_files.recipe_id = recipes.id
    INNER JOIN files ON recipe_files.file_id = files.id
    WHERE recipes.title ILIKE $1 
    `, values) 
  }
} 
