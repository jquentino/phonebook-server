require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const MONGO_URI = process.env.MONGO_URI

console.log("Connecting to MongoDB...")
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true
  }
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
