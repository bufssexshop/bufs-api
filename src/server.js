require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const { connect } = require('./db')
const express = require('express')
const bodyParser = require('body-parser')
const usuarioRouter = require('./routes/usuario')
const productoRouter = require('./routes/producto')

const port = process.env.PORT || 8000
const app = express()
connect()

app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.json())
app.use(cors({
  origin: [process.env.FRONTEND, process.env.ADMON, process.env.DEV, 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}))

app.options('*', cors())
app.use(morgan('dev'))

app.use('/productos', productoRouter)
app.use('/usuarios', usuarioRouter)

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`)
})
