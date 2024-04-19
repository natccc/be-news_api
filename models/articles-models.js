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
  limit = "all",
  p 
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

  if(p){
    if(isNaN(p)){
      return Promise.reject({ status: 400, message: "invalid query" })
    }
  }
  if ((isNaN(limit) && limit !== "all")){
    return Promise.reject({ status: 400, message: "invalid query" });
  }
  if (!validQuery.includes(sort_by) || !validQuery.includes(order)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }

  if (p){
    if(limit==="all") {
    limit = 10;
  }
  }  
  let offset = 0;
  if (limit!=="all") {
    if(!p){
      p =1
    }
    offset = limit * (p - 1);
  }

  const queryVals = [];
  let sqlQueryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes,
  articles.article_img_url,
   COUNT(comment_id)::int AS comment_count
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id`;
  if (topic) {
    queryVals.push(topic);
    sqlQueryStr += ` HAVING articles.topic = $1`;
  }
  sqlQueryStr += ` ORDER BY ${sort_by} ${order} LIMIT ${limit} OFFSET ${offset}`;
  return db.query(sqlQueryStr, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "not found",
      });
    }
    return rows;
  })
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
exports.removeArticle = (article_id) => {
  return db
    .query(`DELETE FROM comments WHERE article_id = $1`, [article_id])
    .then(() => {
      return db
        .query(`DELETE FROM articles WHERE article_id =$1 RETURNING *`, [
          article_id,
        ])
        .then(({ rows }) => {
          if (rows.length === 0) {
            return Promise.reject({
              status: 404,
              message: "article_id not found",
            });
          }
        });
    });
};
