const { model, models, Schema } = require('mongoose')
const monngosePagination = require('mongoose-paginate-v2')

const productSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    validate: {
      async validator (codigo) {
        try {
          const producto = await models.Producto.findOne({ codigo })
          return !producto
        } catch (error) {
          return false
        }
      },
      message: 'El código ya está en uso'
    }
  },
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  precioCredito: {
    type: Number,
    required: true
  },
  promocion: {
    type: Boolean,
    required: true
  },
  valorPromocion: {
    type: Number,
    required: true
  },
  detalles: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  subcategoria: {
    type: String,
    required: true
  },
  categoriaDos: {
    type: String
  },
  subcategoriaDos: {
    type: String
  },
  disponible: {
    type: Boolean,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  image2: {
    type: String
  },
  pictureId: {
    type: String,
    required: true
  },
  pictureId2: {
    type: String
  }
}, {
  timestamps: true
})

productSchema.plugin(monngosePagination)

const Producto = model('Producto', productSchema)

module.exports = Producto
