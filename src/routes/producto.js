const { auth } = require("../utils/auth");
const router = require('express').Router();
const { cloudinaryService } = require('../utils/cloudinary');
const {
  getPromotions,
  createProduct,
  getProducts,
  getProduct,
  getSearch
} = require('../controllers/product.controller');

router.route('/getProducts').get(getProducts);
router.route('/getSearch').post(auth, getSearch);
router.route('/getProduct/:_id').get(getProduct);
router.route('/getPromotions').get(auth, getPromotions);
router.route('/crear').post(auth, cloudinaryService, createProduct);

module.exports = router