const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => rows);
};

exports.fetchEndpoints = () => {
  return fs
    .readFile("endpoints.json", "utf8")
    .then((results) => results)
};
