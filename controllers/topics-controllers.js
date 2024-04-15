const { fetchTopics, fetchEndpoints, fetchArticleById } = require("../models/topics-models.js");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getEndpoints = (req, res, next) => {
  return fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send(JSON.parse(endpoints));
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const {article_id} = req.params
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({article});
    })
    .catch(next);
}
