require('dotenv').config()
const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI
const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

main = () => {
  mongoose.set('strictQuery', false)
  mongoose.connect(MONGO_URI)

  if (process.argv.length == 4) {
    const name = process.argv[2]
    const number = process.argv[3]
    addNewContact(name, number)
  } else if (process.argv.length == 2) {
    showAllContacts()
  } else {
    console.log("Insert a valid number of arguments")
    mongoose.connection.close()
    process.exit(1)
  }


}

showAllContacts = () => {
  console.log(`phonebook: `)
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
}

addNewContact = (name, number) => {
  const newContact = new Contact({
    name,
    number
  })

  newContact.save().then(result => {
    console.log(`contact saved with id ${result._id}!`)
    mongoose.connection.close()
  })
}

if (require.main === module) {
  main()
}