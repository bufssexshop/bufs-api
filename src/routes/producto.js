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
  getPromotions,
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  getSearch
} = require('../controllers/product.controller')

router.route('/getProducts').get(getProducts)
router.route('/getSearch').post(auth, getSearch)
router.route('/getProduct/:_id').get(getProduct)
router.route('/getPromotions').get(auth, getPromotions)
router.route('/deleteProduct').post(auth, deleteProduct)
router.route('/deletePromotion').post(auth, deletePromotion)
router.route('/deletePromotions').post(auth, deletePromotions)
router.route('/crear').post(auth, cloudinaryService, createProduct)
router.route('/changePromotionPrice').post(auth, changePromotionPrice)
router.route('/createPromotionGeneral').post(auth, createPromotionGeneral)
router.route('/updateProductWithOutPicture').post(auth, updateProductWithOutPicture)
router.route('/updateProductWithPicture').post(auth, cloudinaryService, updateProductWithPicture)

module.exports = router
