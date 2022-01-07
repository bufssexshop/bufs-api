const { auth } = require('../utils/auth')
const router = require('express').Router()
const { signin, signup, getUser } = require('../controllers/user.controller')

// router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/signup').post(signup)
router.route('/getUser').get(auth, getUser)

module.exports = router
