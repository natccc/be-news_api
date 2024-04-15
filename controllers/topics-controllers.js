const {fetchTopics} = require("../models/topics-models.js");

const getTopics = (req, res, next) => {
  return fetchTopics().then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

module.exports = {getTopics}