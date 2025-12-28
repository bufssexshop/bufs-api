import { v2 as cloudinary } from 'cloudinary'
import User from '../models/user.model.js'
import Product from '../models/product.model.js'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const createProduct = async (req, res, next) => {
  try {
    const { body, files } = req

    if (!files || !files.image)
      return res.status(400).json({
        success: false,
        message: 'The primary image is required'
      })

    const productData = { ...body }
    const uploadTasks = []

    // Upload files/images
    if (files && (files.image || files.image2)) {
      if (files.image)
        uploadTasks.push(
          uploadToCloudinary(files.image[0].buffer)
            .then(result => {
              productData.image = result.secure_url
              productData.pictureId = result.public_id
            })
        )

      if (files.image2)
        uploadTasks.push(
          uploadToCloudinary(files.image2[0].buffer).then(result => {
            productData.image2 = result.secure_url
            productData.pictureId2 = result.public_id
          })
        )

      await Promise.all(uploadTasks)
    }

    const newProduct = await Product.create(productData)

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    })
  } catch (error) {
    next(error)
  }
}

export async function getProduct (req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findById(id).lean()

    if (!product) {
      return res.status(404).json({
        message: 'product not found'
      })
    }

    res.status(200).json({
      success: true,
      product,
    })
  } catch (error) {
    next(error)
  }
}

export async function getAllProducts (req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50)

    const { search, min, max, category, subcategory } = req.query
    const query = {}

    if (!req.user || req.user.role !== 'admin')
      query.available = true

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i')
      query.$or = [
        { name: searchRegex },
        { code: searchRegex }
      ]
    }

    if (category) query.category = category

    if (subcategory) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ subcategory }, { secondarySubcategory: subcategory }]
      });
    }

    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);

    if (!isNaN(minNum) || !isNaN(maxNum)) {
      query.price = {};
      if (!isNaN(minNum) && minNum >= 0) query.price.$gte = minNum;
      if (!isNaN(maxNum) && maxNum >= 0) query.price.$lte = maxNum;

      if (Object.keys(query.price).length === 0) delete query.price;
    }

    const options = {
      page,
      limit,
      customLabels: { totalDocs: 'totalProducts', docs: 'products' },
      sort: { createdAt: -1 }
    };

    const result = await Product.paginate(query, options)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export async function getProducts (req, res, next) {
  try {
    const { category, subcategory } = req.params
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50)

    const query = {
      category,
      $or: [
        { subcategory },
        { secondarySubcategory: subcategory }
      ]
    }

    if (!req.user || req.user.role !== 'admin')
      query.available = true

    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: 'totalProducts',
        docs: 'products'
      },
      sort: { createdAt: -1 }
    }

    const result = await Product.paginate(query, options)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export async function getCategoryProducts (req, res, next) {
  try {
    const { category } = req.params

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50)

    const query = { category }

    if (!req.user || req.user.role !== 'admin') query.available = true

    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: 'totalProducts',
        docs: 'products'
      },
      sort: { createdAt: -1 }
    }

    const result = await Product.paginate(query, options)
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export async function getSearch (req, res, next) {
  try {
    const { search, type } = req.body

    if (typeof search !== 'string' || typeof type !== 'string') {
      return res.status(400).json({
        message: 'Search and type must be strings'
      })
    }

    const trimmedSearch = search.trim()

    if (!trimmedSearch)
      return res.status(400).json({
        message: 'search cannot be empty'
      })

    if (!['code', 'name'].includes(type))
      return res.status(400).json({
        message: 'type must be either "code" or "name"'
      })

    const query = {}

    if (!req.user || req.user.role !== 'admin')
      query.available = true

    const regex = new RegExp(trimmedSearch, 'i')

    if (type === 'code')
     query.code = regex
    else
      query.name = regex

    const products = await Product.find(query).lean()
    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

export async function getAdvancedSearch (req, res, next) {
  try {
    const { search, min, max } = req.body
    const query = {}

    if (!req.user || req.user.role !== 'admin')
      query.available = true

    if (search && search.trim())
      query.name = new RegExp(search.trim(), 'i')

    const minNum = Number(min)
    const maxNum = Number(max)

    if (!isNaN(minNum) || !isNaN(maxNum)) {
      query.price = {}
      if (minNum > 0) query.price.$gte = minNum
      if (maxNum > 0) query.price.$lte = maxNum

      if (Object.keys(query.price).length === 0) delete query.price
    }

    const products = await Product.find(query).lean()

    res.status(200).json(products)
  } catch (error) {
    next(error)
  }
}

export async function getPromotions (req, res, next) {
  try {
    const promotions = await Product.find({ promotion: true }).lean()

    res.status(200).json(promotions)
  } catch (error) {
    next(error)
  }
}

export async function deletePromotions (req, res, next) {
  try {
    const result = await Product.updateMany(
      { promotion: true },
      {
        promotion: false,
        promotionValue: 0
      }
    )

    res.status(200).json({
      message: 'All active promotions have been cleared successfully',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

export async function deletePromotion (req, res, next) {
  try {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({
        message: 'Product ID is required'
      })
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          promotion: false,
          promotionValue: 0
        }
      },
      { new: true }
    ).lean()

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({
      message: 'Promotion removed successfully',
      product: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

export async function changePromotionPrice (req, res, next) {
  try {
    const { id, newPromotionPrice } = req.body
    const price = Number(newPromotionPrice)

    if (!id || isNaN(price))
      return res.status(400).json({
        message: 'Product ID and new promotion price are required'
      })

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          promotion: true,
          promotionValue: price
        }
      },
      { new: true }
    ).lean()

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({
      message: 'Promotion price updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

export async function updateProduct (req, res, next) {
  try {
    const { id } = req.params
    const { body, files } = req

    const product = await Product.findById(id)

    if (!product)
      return res.status(404).json({ message: 'Product not found' })

    const updateData = { ...body }
    const uploadTasks = []

    if (files?.image) {
      if (product.pictureId) deleteFromCloudinary(product.pictureId)

      uploadTasks.push(
        uploadToCloudinary(files.image[0].buffer).then(result => {
          updateData.image = result.secure_url
          updateData.pictureId = result.public_id
        })
      )
    }

    if (files && files?.image2) {
      if (product.pictureId2) deleteFromCloudinary(product.pictureId2)

      uploadTasks.push(
        uploadToCloudinary(files.image2[0].buffer).then(result => {
          updateData.image2 = result.secure_url
          updateData.pictureId2 = result.public_id
        })
      )
    }

    await Promise.all(uploadTasks)

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteProduct (req, res, next) {
  try {
    const { id } = req.params

    const product = await Product.findById(id)

    if (!product)
      return res.status(404).json({ message: 'Product not found' })

    const deletionTasks = []
    if (product.pictureId) deletionTasks.push(deleteFromCloudinary(product.pictureId))
    if (product.pictureId2) deletionTasks.push(deleteFromCloudinary(product.pictureId2))

    await Promise.all(deletionTasks)

    await Product.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message: 'Product and associated images deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}

export async function createGeneralPromotion (req, res, next) {
  try {
    const { promotionValue } = req.body

    if (promotionValue === undefined || promotionValue < 0) {
      return res.status(400).json({
        message: 'A valid promotion value is required'
      })
    }

    const result = await Product.updateMany(
      {},
      {
        $set: {
          promotion: true,
          promotionValue: Number(promotionValue)
        }
      }
    )

    res.status(200).json({
      message: 'General promotion applied successfully',
      modifiedCount: result.modifiedCount
    })
  } catch (error) {
    next(error)
  }
}

export async function getIndicators (req, res, next) {
  try {
    const [totalProducts, activePromotions, inactiveProducts, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ promotion: true }),
      Product.countDocuments({ available: false }),
      User.countDocuments()
    ])

    res.status(200).json({
      totalProducts,
      activePromotions,
      inactiveProducts,
      totalUsers
    })
  } catch (error) {
    next(error)
  }
}

