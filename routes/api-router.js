const router = require('express').Router()
const{getEndpoints}= require('../controllers/api-controllers')
const topicsRouter = require('./topics-router')
const articlesRouter= require('./articles-router')
const commentsRouter= require('./comments-router')

router.get('/',getEndpoints)
router.use('/topics', topicsRouter)
router.use('/articles', articlesRouter)
router.use('/comments', commentsRouter)

module.exports = router