const router = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticle,
  postArticle,
  deleteArticle,
} = require("../controllers/articles-controllers");
const {
  getComments,
  postComment,
} = require("../controllers/comments-controllers");

router.route("/").get(getArticles).post(postArticle);

router
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticle);

router.route("/:article_id/comments").get(getComments).post(postComment);

module.exports = router;
