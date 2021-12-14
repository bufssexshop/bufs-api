const router = require('express').Router();
const { cloudinaryService } = require('../utils/cloudinary');
const { createProduct, getProduct } = require('../controllers/product.controller');

router.route('/getProduct/:_id').get(getProduct);
router.route('/crear').post(cloudinaryService, createProduct);

module.exports = router