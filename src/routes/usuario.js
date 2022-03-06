const { auth } = require('../utils/auth')
const router = require('express').Router()
const { signin, signup, getUser, getUsers } = require('../controllers/user.controller')

router.route('/signin').post(signin)
router.route('/signup').post(signup)
router.route('/getUser').get(auth, getUser)
router.route('/getUsers').get(auth, getUsers)

module.exports = router
