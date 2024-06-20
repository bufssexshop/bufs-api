const { auth } = require('../utils/auth')
const router = require('express').Router()
const { cloudinaryService } = require('../utils/cloudinary')
const {
  createPromotionGeneral,
  changePromotionPrice,
  getCategoryProducts,
  getAdvancedSearch,
  deletePromotions,
  deletePromotion,
  getAllProducts,
  updateProduct,
  getPromotions,
  getIndicators,
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getSearch
} = require('../controllers/product.controller')

router.route('/all').get(auth, getAllProducts)
router.route('/getSearch').post(getSearch)
router.route('/getProduct/:_id').get(getProduct)
router.route('/getPromotions').get(getPromotions)
router.route('/getIndicators').get(auth, getIndicators)
router.route('/deleteProduct').post(auth, deleteProduct)
router.route('/getAdvancedSearch').post(getAdvancedSearch)
router.route('/getProducts/:category/:subcategory').get(getProducts)
router.route('/deletePromotion').post(auth, deletePromotion)
router.route('/deletePromotions').post(auth, deletePromotions)
router.route('/crear').post(auth, cloudinaryService, createProduct)
router.route('/getCategoryProducts/:category').get(getCategoryProducts)
router.route('/changePromotionPrice').post(auth, changePromotionPrice)
router.route('/createPromotionGeneral').post(auth, createPromotionGeneral)
router.route('/updateProduct').post(auth, cloudinaryService, updateProduct)

module.exports = router
