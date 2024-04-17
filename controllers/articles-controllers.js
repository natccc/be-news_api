const {
  fetchArticleById,
  fetchArticles,
  editArticle,
  insertArticle,
} = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {topic, sort_by, order, limit, p} = req.query
  return fetchArticles(topic, sort_by, order, limit, p)
    .then((articles) => {
      const total_count = articles.length
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};
exports.patchArticle= (req, res, next) => {
  const { article_id } = req.params;
  const {inc_votes} = req.body;
  return editArticle(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}
exports.postArticle= (req, res, next) => {
  const {author, title, body, topic, article_img_url} = req.body;
  return insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(err=>{
      next(err);
    });
}