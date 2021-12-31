const { auth } = require("../utils/auth");
const router = require('express').Router();
const { cloudinaryService } = require('../utils/cloudinary');
const {
  createProduct,
  getProduct,
  getProducts,
  getSearch
} = require('../controllers/product.controller');

router.route('/getProducts').get(getProducts);
router.route('/getSearch').post(auth, getSearch);
router.route('/getProduct/:_id').get(getProduct);
router.route('/crear').post(auth, cloudinaryService, createProduct);

module.exports = router