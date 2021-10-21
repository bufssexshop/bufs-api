const Producto = require('../models/producto.model')


module.exports = {
  async createProduct(req, res){
    try {
      const { body } = req
      await Producto.create(
        {
          codigo: body.codigo,
          nombre: body.nombre,
          precio: body.precio,
          categoria: body.categoria,
          subcategoria: body.subcategoria,
          image: body.image.url,
          detalles: body.detalles
        }
      )
      console.log('pasamos el create')

      res.status(201).json('Producto creado exitosamente')
    } catch(error ){
      res.status(400).json({error})
    }
  },
}