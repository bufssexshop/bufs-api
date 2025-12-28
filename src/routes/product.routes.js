import express from 'express'
import auth from '../utils/auth.js'
import { isAdmin } from '../middlewares/roleAuth.js'
import { upload } from '../middlewares/upload.middleware.js'
import { productSchema, updateProductSchema } from '../validators/product.validator.js'
import { validateResource } from '../middlewares/validator.middleware.js'

import {
  createGeneralPromotion,
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
} from '../controllers/product.controller.js'
import { optionalAuth } from '../middlewares/optionalAuth.js'

const router = express.Router()

// --- MIDDLEWARES ---
const createProductMiddlewares = [
  auth,
  isAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),
  validateResource(productSchema),
]

const updateProductMiddlewares = [
  auth,
  isAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),
  validateResource(updateProductSchema),
]

// --- ROUTES ---
router.post('/', createProductMiddlewares, createProduct)

router.get('/search', optionalAuth, getSearch)
router.post('/search/advanced', optionalAuth, getAdvancedSearch)
router.get('/promotions', getPromotions)
router.get('/filter', optionalAuth, getAllProducts)
router.get('/indicators', [auth, isAdmin], getIndicators) // --- PROTECTED ROUTE --- (AUTH REQUIRED)

router.get('/category/:category', optionalAuth,getCategoryProducts)
router.get('/category/:category/:subcategory', optionalAuth, getProducts)

// Promotions management
router.delete('/promotions', [auth, isAdmin], deletePromotions) // --- PROTECTED ROUTE --- (AUTH REQUIRED)
router.post('/promotions/general', [auth, isAdmin], createGeneralPromotion) // --- PROTECTED ROUTE --- (AUTH REQUIRED)
router.patch('/:id/promotion-price', [auth, isAdmin], changePromotionPrice) // --- PROTECTED ROUTE --- (AUTH REQUIRED)
router.delete('/:id/promotion', [auth, isAdmin], deletePromotion) // --- PROTECTED ROUTE --- (AUTH REQUIRED)

router.get('/:id', getProduct)
router.patch('/:id', updateProductMiddlewares, updateProduct)
router.delete('/:id', [auth, isAdmin], deleteProduct) // --- PROTECTED ROUTE --- (AUTH REQUIRED)

export default router
