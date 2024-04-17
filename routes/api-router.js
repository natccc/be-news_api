const router = require('express').Router()
const{getEndpoints}= require('../controllers/api-controllers')
const topicsRouter = require('./topics-router')
const articlesRouter= require('./articles-router')
const commentsRouter= require('./comments-router')
const usersRouter= require('./users-router')

router.get('/',getEndpoints)
router.use('/topics', topicsRouter)
router.use('/articles', articlesRouter)
router.use('/comments', commentsRouter)
router.use('/users', usersRouter)

module.exports = router