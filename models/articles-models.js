const db = require("../db/connection.js");
exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles 
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    HAVING articles.article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article_id not found",
        });
      }
      return rows[0];
    });
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
    });
};
exports.fetchArticles = (topic, sort_by = "created_at", order = "desc") => {
  const validQuery = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_img_url",
    "article_id",
    "comment_count",
    "asc",
    "desc",
  ];
  if (!validQuery.includes(sort_by) || !validQuery.includes(order)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }
  const queryVals = [];
  let sqlQueryStr = `SELECT articles.*, COUNT(comment_id) AS comment_count
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id`;
  if (topic) {
    queryVals.push(topic);
    sqlQueryStr += ` HAVING articles.topic = $1`;
  }
  sqlQueryStr += ` ORDER BY ${sort_by} ${order}`;
  return db.query(sqlQueryStr, queryVals).then(({ rows }) => {
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
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article_id not found",
        });
      }
      return rows[0];
    });
};
