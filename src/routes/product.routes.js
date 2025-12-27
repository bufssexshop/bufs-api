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

// --- PUBLIC ROUTES ---
// Searches
router.get('/search', optionalAuth, getSearch)
router.post('/search/advanced', optionalAuth, getAdvancedSearch)

// Specific listeds
router.get('/promotions', getPromotions)

// Filtered by hierarchy (Navigation)
router.get('/category/:category', optionalAuth,getCategoryProducts)
router.get('/category/:category/:subcategory', optionalAuth, getProducts)

// Product Detail
router.get('/:id', getProduct)


// --- PROTECTED ROUTES --- (AUTH REQUIRED)
router.get('/all', optionalAuth, getAllProducts)
router.get('/indicators', [auth, isAdmin], getIndicators)

// Create and update resources
router.post('/', createProductMiddlewares, createProduct)
router.patch('/:id', updateProductMiddlewares, updateProduct)

// Delete product
router.delete('/:id', [auth, isAdmin], deleteProduct)

// Promotions management
router.post('/promotions/general', [auth, isAdmin], createGeneralPromotion)
router.patch('/:id/promotion-price', [auth, isAdmin], changePromotionPrice)
router.delete('/promotions', [auth, isAdmin], deletePromotions)
router.delete('/:id/promotion', [auth, isAdmin], deletePromotion)



export default router
