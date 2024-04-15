const { fetchTopics, fetchEndpoints } = require("../models/topics-models.js");

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
