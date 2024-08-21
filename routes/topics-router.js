const router= require('express').Router()
const {getTopics, postTopic} = require('../controllers/topics-controllers')

router.route('/').get(getTopics).post(postTopic)

module.exports = router