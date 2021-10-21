require("dotenv").config()
const express = require("express")
const cors = require('cors')
const morgan = require('morgan')
const {connect} = require("./db")
const productoRouter = require("./routes/producto")

const port = process.env.PORT || 8000
const app = express()
connect()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/productos', productoRouter)
app.get('/', (req, res) => {
  res.status(200).json('¡Hola!, aún estamos trabajando en el servidor, por ahora bienvenido a Bufssexshop...')
})

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
});