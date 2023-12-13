const { auth } = require('../utils/auth')
const router = require('express').Router()
const { cloudinaryService } = require('../utils/cloudinary')
const {
  updateProductWithOutPicture,
  updateProductWithPicture,
  createPromotionGeneral,
  changePromotionPrice,
  deletePromotions,
  deletePromotion,
  getAllProducts,
  getPromotions,
  getIndicators,
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getSearch
} = require('../controllers/product.controller')

router.route('/all').get(auth, getAllProducts)
router.route('/getSearch').post(auth, getSearch)
router.route('/getProduct/:_id').get(getProduct)
router.route('/getPromotions').get(getPromotions)
router.route('/getIndicators').get(auth, getIndicators)
router.route('/deleteProduct').post(auth, deleteProduct)
router.route('/getProducts/:subcategory').get(getProducts)
router.route('/deletePromotion').post(auth, deletePromotion)
router.route('/deletePromotions').post(auth, deletePromotions)
router.route('/crear').post(auth, cloudinaryService, createProduct)
router.route('/changePromotionPrice').post(auth, changePromotionPrice)
router.route('/createPromotionGeneral').post(auth, createPromotionGeneral)
router.route('/updateProductWithOutPicture').post(auth, updateProductWithOutPicture)
router.route('/updateProductWithPicture').post(auth, cloudinaryService, updateProductWithPicture)

module.exports = router
