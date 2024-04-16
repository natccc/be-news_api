const router = require('express').Router();
const { getUsers } = require('../controllers/users-controllers');

router.get('/', getUsers);

module.exports = router;
