const router = require("express").Router();
const {
  deleteComment,
  patchComment,
} = require("../controllers/comments-controllers");

router.route("/:comment_id").delete(deleteComment).patch(patchComment);
module.exports = router;
