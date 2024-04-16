const db = require("../db/connection.js");
exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article_id not found",
        });
      }
      return rows[0];
    })
};

exports.checkArticleExists = (article_id) => {
  return db
   .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
   .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article_id not found",
        });
      }
      return rows[0];
    })
};
exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count
     FROM articles LEFT JOIN comments 
     ON articles.article_id = comments.article_id
     GROUP BY articles.article_id
     ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};


exports.editArticle = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      
      if(rows.length===0){
        return Promise.reject({
          status: 404,
          message: "article_id not found",
        });
      }
      return rows[0];
    })
  };

