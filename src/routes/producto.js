const router = require('express').Router()
const { createProduct } = require('../controllers/product.controller')
const { cloudinaryService } = require('../utils/cloudinary')

router.route('/crear').post(cloudinaryService, createProduct)

module.exports = router