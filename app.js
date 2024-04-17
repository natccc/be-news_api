const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use(express.json());
app.use("/api", apiRouter);

//error handling by express
app.all("*", (req, res, next) => {
  res.status(404).send({ message: "endpoint not found" });
});

//psql errors
app.use((err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ message: "bad request" });
  }
  next(err);
});

//posting comment to non existing id
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ message: "not found" });
  }
  next(err);
});

//custom error handling
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
});
app.use((err, req, res, next) => {
  res.status(500).send({ message: "internal server error" });
});

module.exports = app;
