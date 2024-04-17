const db = require("../db/connection.js");
exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles 
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
exports.fetchArticles = (
  topic,
  sort_by = "created_at",
  order = "desc",
  limit = "10",
  p = "1"
) => {
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
  if (isNaN(limit) || isNaN(p)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }
  if (!validQuery.includes(sort_by) || !validQuery.includes(order)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }
  let offset = 0;
  if (p) {
    offset = limit * (p - 1);
  }

  const queryVals = [];
  let sqlQueryStr = `SELECT articles.*, COUNT(comment_id)::int AS comment_count
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id`;
  if (topic) {
    queryVals.push(topic);
    sqlQueryStr += ` HAVING articles.topic = $1`;
  }
  sqlQueryStr += ` ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset}`;
  return db
    .query(sqlQueryStr, queryVals)
    .then(({ rows }) => {
      return rows;
    })
};

/*p1, offset 0
p2, offset 10 (limit)
p3, offset 20 limit *2 (p-1)
p4, offset 30
p5, offset 40
p6, offset 50
p7, offset 60


*/
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
exports.insertArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return rows[0];
    });
};
