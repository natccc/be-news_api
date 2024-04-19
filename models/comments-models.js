const db = require('../db/connection')

exports.fetchComments = (article_id,limit="all",p) => {
  if(p){
    if(isNaN(p)){
      return Promise.reject({ status: 400, message: "invalid query" })
    }
  }
  if ((isNaN(limit) && limit !== "all")){
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
    return db
      .query(
        `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset} `,
        [article_id]
      )
      .then(({ rows }) => {
        return rows;
      });
  };
  
  exports.insertComment = (article_id, username, body) => {
    return db
      .query(
        `INSERT INTO comments
    (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *`,
        [username, body, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      })
    };
exports.removeComment = (comment_id)=>{
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id])
    .then(({rows})=>{
        if(rows.length===0){
            return Promise.reject({
                status: 404,
                message: "comment_id not found",
            });
        }
    })
}
exports.updateComment = (comment_id, inc_votes)=>{
  return db.query(`UPDATE comments SET votes = votes+ $1 
   WHERE comment_id = $2 RETURNING *`, [inc_votes, comment_id])
  .then(({rows})=>{
      if(rows.length===0){
          return Promise.reject({
              status: 404,
              message: "comment_id not found",
          });
      }
      return rows[0];
  })
}