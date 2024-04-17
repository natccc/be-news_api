const router= require('express').Router()
const{getArticleById, getArticles, patchArticle, postArticle}=require('../controllers/articles-controllers')
const { getComments, postComment} = require('../controllers/comments-controllers')

router.get('/', getArticles)
router.post('/', postArticle)
router.get('/:article_id', getArticleById)
router.patch('/:article_id', patchArticle)
router.get('/:article_id/comments', getComments)
router.post('/:article_id/comments', postComment)


module.exports = router