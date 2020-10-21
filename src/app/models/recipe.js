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
    SELECT recipes.*, chefs.name 
    FROM recipes
    INNER JOIN chefs
    ON recipes.chef_id = chefs.id
    WHERE recipes.id=$1
    `, [id])
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

  delete(id) {
    return db.query(`
    DELETE FROM recipes
    WHERE id=$1
    `, [id])
  },

  showChefs() {
    return db.query(`
    SELECT chefs.*, count(recipes) as total_recipes
    FROM recipes
    LEFT JOIN chefs 
    ON recipes.chef_id = chefs.id
    GROUP BY chefs.id
    `)
  },

  results(filter) {
    const values = [`%${filter}%`]
    return db.query(`
    SELECT r.title, r.image, r.id, c.name
    FROM recipes r
    LEFT JOIN chefs c
    ON c.id = r.chef_id
    WHERE r.title ILIKE $1 
    `, values)
  }
} 
