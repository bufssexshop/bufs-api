require("dotenv").config();
const cors = require('cors');
const morgan = require('morgan');
const {connect} = require("./db");
const express = require("express");
const usuarioRouter = require("./routes/usuario");
const productoRouter = require("./routes/producto");

const port = process.env.PORT || 8000;
const app = express();
connect();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND,
}))
app.use(morgan('dev'));

app.use('/productos', productoRouter);
app.use('/usuarios', usuarioRouter);

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});