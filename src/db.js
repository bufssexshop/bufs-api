const mongoose = require("mongoose")

function connect() {
  const MongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/bufssexshopdb"
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }

  mongoose.connect(MongoURI, options)

  const {connection} = mongoose

  connection.once("open", () =>
    console.log("Connection established successfully")
  )

  connection.on("error", error => {
    console.log("Connection error", error)
  })
  return connection
}

module.exports = {connect}