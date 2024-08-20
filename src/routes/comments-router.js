const router = require('express').Router()
const {deleteComment, patchComment} = require('../controllers/comments-controllers')

router.delete('/:comment_id', deleteComment)
router.patch('/:comment_id', patchComment)
module.exports = router