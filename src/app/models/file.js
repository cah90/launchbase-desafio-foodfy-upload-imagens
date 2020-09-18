const db = require("../../config/db")

module.exports = {
  create(data) {
    const query = `
    INSERT INTO files (
      name,
      path
    ) VALUES ($1, $2)
    RETURNING id
    `
    const values = [ 
      data.filename,
      data.path
    ]

    return db.query(query, values) 
  },

  find(recipeId) {
    const query = `
      SELECT *
      FROM recipe_files
      INNER JOIN files ON recipe_files.file_id = files.id
      WHERE recipe_files.recipe_id = $1
    `
    
    return db.query(query, [recipeId])
  }
}
