const router = require('express').Router();
const { signin, signup } = require('../controllers/user.controller');

// router.route('/signup').post(signup)
router.route('/signin').post(signin);
router.route('/signup').post(signup);

module.exports = router;