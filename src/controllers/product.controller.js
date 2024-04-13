const cloudinary = require('cloudinary').v2
const User = require('../models/usuario.model')
const Producto = require('../models/producto.model')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const successMessage = 'success'

module.exports = {
  async createProduct (req, res) {
    try {
      const { body } = req
      await Producto.create(
        {
          image: body.image,
          image2: body.image2,
          codigo: body.codigo,
          nombre: body.nombre,
          precio: body.precio,
          detalles: body.detalles,
          categoria: body.categoria,
          pictureId: body.pictureId,
          pictureId2: body.pictureId2,
          promocion: body.promocion,
          disponible: body.disponible,
          categoriaDos: body.categoriaDos,
          subcategoria: body.subcategoria,
          precioCredito: body.precioCredito,
          valorPromocion: body.valorPromocion,
          subcategoriaDos: body.subcategoriaDos
        }
      )

      res.status(201).json({ message: successMessage })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async getProduct (req, res) {
    try {
      const { params: { _id } } = req
      const product = await Producto.findById({ _id })

      res.status(200).json(product)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async getAllProducts (req, res) {
    const { query: { page, limit } } = req

    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: 'totalProducts',
        docs: 'products'
      }
    }

    const query = {}

    try {
      const result = await Producto.paginate(query, options)

      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async getProducts (req, res) {
    const { params: { category, subcategory }, query: { page, limit } } = req

    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: 'totalProducts',
        docs: 'products'
      }
    }

    const query = {
      $and: [
        { categoria: category }
      ],
      $or: [
        { subcategoria: subcategory },
        { subcategoriaDos: subcategory }
      ]
    }

    try {
      const result = await Producto.paginate(query, options)

      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async getSearch (req, res) {
    try {
      const {
        body: { typeSearch, search }
      } = req

      let products = {}

      if (typeSearch === 'forCode') {
        products = await Producto.find({ codigo: new RegExp(search, 'i') })
      } else {
        products = await Producto.find({ nombre: new RegExp(search, 'i') })
      }

      res.status(200).json(products)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async  getAdvancedSearch (req, res) {
    try {
      const {
        body: { search, min, max }
      } = req

      let products = {}
      let query = { nombre: new RegExp(search, 'i') }
      if (min > 0) query = { ...query, precio: { ...query.precio, $gte: min } }
      if (max > 0) query = { ...query, precio: { ...query.precio, $lte: max } }
      products = await Producto.find(query)

      res.status(200).json(products)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async getPromotions (req, res) {
    try {
      const promotions = await Producto.find({ promocion: true })

      res.status(200).json(promotions)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async deletePromotions (req, res) {
    try {
      await Producto.updateMany({ promocion: true }, { promocion: false, valorPromocion: 0 })
      const promotions = await Producto.find({ promocion: true })
      const response = {
        message: 'Las promociones fueron eliminadas',
        promotions: promotions
      }
      res.status(200).json(response)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async deletePromotion (req, res) {
    try {
      const { _id } = req.body
      await Producto.findByIdAndUpdate(_id, { $set: { promocion: false, valorPromocion: 0 } })
      const promotions = await Producto.find({ promocion: true })
      const response = {
        message: 'La promoción fué eliminada',
        promotions: promotions
      }
      res.status(200).json(response)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async changePromotionPrice (req, res) {
    try {
      const { _id, newPromotionPrice } = req.body
      await Producto.findByIdAndUpdate(_id, { $set: { promocion: true, valorPromocion: newPromotionPrice } })
      const promotions = await Producto.find({ promocion: true })
      const response = {
        message: 'Se cambió el valor de promoción',
        promotions: promotions
      }
      res.status(200).json(response)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  async updateProduct (req, res) {
    try {
      const { body } = req

      const currentProduct = await Producto.findById(body._id)
      if (body.image && currentProduct.image) await cloudinary.uploader.destroy(currentProduct.pictureId)
      if (body.image2 && currentProduct.image2) await cloudinary.uploader.destroy(currentProduct.pictureId2)

      await Producto.findByIdAndUpdate(
        body._id,
        body,
        { new: true }
      )

      res.status(200).json({ message: successMessage })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async deleteProduct (req, res) {
    try {
      const { body } = req
      const producto = await Producto.findById(body._id)
      await cloudinary.uploader.destroy(producto.pictureId)
      if (producto.pictureId2) await cloudinary.uploader.destroy(producto.pictureId2)
      await Producto.findByIdAndDelete(body._id)

      res.status(200).json({ message: successMessage })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async createPromotionGeneral (req, res) {
    try {
      const { body } = req
      await Producto.updateMany({}, { promocion: true, valorPromocion: body.valorPromocion })
      const productos = await Producto.find()
      res.status(201).json({ message: successMessage, promotions: productos })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async getIndicators (req, res) {
    try {
      const cantidad = await Producto.count()
      const promotions = await Producto.find({ promocion: true })
      const inactivos = await Producto.find({ disponible: false })
      const usuario = await User.count()
      res.status(200).json({ cantidad: cantidad, promociones: promotions.length, inactivos: inactivos.length, usuarios: usuario })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}
