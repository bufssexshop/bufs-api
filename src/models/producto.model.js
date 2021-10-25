const { model, models, Schema } = require('mongoose')

const userSchema = new Schema({
  codigo: {
    type: String,
    required: true,
    validate: {
      async validator(codigo){
        try{
          const producto = await models.Producto.findOne({ codigo })
          return !producto
        } catch(error){
          return false
        }
      },
      message: 'El código ya está en uso'
    },
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  detalles: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  subcategoria: {
    type: String,
    required: true,
  },
  disponible: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

const Producto = model('Producto', userSchema)

module.exports = Producto
