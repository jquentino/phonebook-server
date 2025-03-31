const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/Contact')

const app = express()

app.use(express.json())
app.use(express.static("dist"))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const generateId = () => {
  return Math.random().toString(36).substring(2, 7)
}

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id).then(contact => {
    response.json(contact)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Contact.findByIdAndDelete(id).then(
    result => response.status(204).end()
  )
})

app.post('/api/persons', (request, response) => {
  const reqPerson = request.body
  Contact.insertOne({
    name: reqPerson.name,
    number: reqPerson.number
  }).then(
    insertedData => response.json(insertedData)
  )
})

app.get('/info', (request, response) => {
  // nPersons = Contact.where(;{}).countDocuments()
  const DateOptions = {
    datastyle: 'full',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'longOffset'
  };

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const dateString = new Date().toLocaleString('en-US', DateOptions)

  Contact.countDocuments({}, { hint: "_id_" }).exec().then(
    (countResult) => {
      console.log('countResult', countResult)
      response.send(
        `Phonebook has info of ${countResult} people
        </br>
        ${dateString} (${timezone})`
      )
    }
  ).catch(
    (error) => {
      response.status(500).send(`Was not possible to get Phonebook info. Error ${error}`)
    }
  )
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server Started')
})