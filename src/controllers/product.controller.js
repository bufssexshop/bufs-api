const cloudinary = require('cloudinary').v2
const User = require('../models/usuario.model')
const Producto = require('../models/producto.model')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

module.exports = {
  async createProduct (req, res) {
    try {
      const { body } = req
      await Producto.create(
        {
          image: body.image,
          codigo: body.codigo,
          nombre: body.nombre,
          precio: body.precio,
          detalles: body.detalles,
          categoria: body.categoria,
          pictureId: body.pictureId,
          promocion: body.promocion,
          disponible: body.disponible,
          categoriaDos: body.categoriaDos,
          subcategoria: body.subcategoria,
          valorPromocion: body.valorPromocion,
          subcategoriaDos: body.subcategoriaDos
        }
      )

      res.status(201).json('Producto creado exitosamente')
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
  async getProducts (req, res) {
    const { body } = req
    try {
      const products = await Producto.find({ $or: [{ subcategoria: body.subcategoria }, { subcategoriaDos: body.subcategoria }] })

      res.status(200).json(products)
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
  async updateProductWithOutPicture (req, res) {
    try {
      const { body } = req

      const producto = await Producto.findByIdAndUpdate(
        body._id,
        body,
        { new: true }
      )

      res.status(201).json({ message: 'Producto modificado exitosamente', producto })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async updateProductWithPicture (req, res) {
    try {
      const { body } = req
      const productoAntes = await Producto.findById(body._id)
      await cloudinary.uploader.destroy(productoAntes.pictureId)

      const productoDespues = await Producto.findByIdAndUpdate(
        body._id,
        body,
        { new: true }
      )

      res.status(201).json({ message: 'Producto modificado exitosamente', producto: productoDespues })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async deleteProduct (req, res) {
    try {
      const { body } = req
      const producto = await Producto.findById(body._id)
      await cloudinary.uploader.destroy(producto.pictureId)
      await Producto.findByIdAndDelete(body._id)

      res.status(201).json({ message: '¡Producto eliminado!, Actualiza o recarga para ver los cambios' })
    } catch (error) {
      res.status(400).json({ error })
    }
  },
  async createPromotionGeneral (req, res) {
    try {
      const { body } = req
      await Producto.updateMany({}, { promocion: true, valorPromocion: body.valorPromocion })
      const productos = await Producto.find()
      res.status(201).json({ message: 'Se creó la promoción general', promotions: productos })
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
      res.status(201).json({ cantidad: cantidad, promociones: promotions.length, inactivos: inactivos.length, usuarios: usuario })
    } catch (error) {
      res.status(400).json({ error })
    }
  }
}
