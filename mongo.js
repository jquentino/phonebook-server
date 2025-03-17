require('dotenv').config()
const mongoose = require('mongoose')

const mongo_user = process.env.MONGO_USER
const mongo_pwd = process.env.MONGO_PWD 

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

main = () => {
  const url = `mongodb+srv://${mongo_user}:${mongo_pwd}@cluster0.lqmx1.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=Cluster0`
  mongoose.set('strictQuery', false)
  mongoose.connect(url)
  
  if (process.argv.length == 4){
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
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
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