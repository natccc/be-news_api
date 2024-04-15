const { fetchTopics } = require("../models/topics-models.js");

exports.getTopics = (req, res, next) => {
  return fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};



