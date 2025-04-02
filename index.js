const express = require('express')
const morgan = require('morgan')
const Contact = require('./models/Contact')

const app = express()

app.use(express.json())
app.use(express.static("dist"))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response, next) => {
  Contact.find({}).then(contacts => {
    response.json(contacts)
  }).catch(
    error => next(error)
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id).then(contact => {
    response.json(contact)
  }).catch(
    error => next(error)
  )
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Contact.findByIdAndDelete(id).then(
    result => response.status(204).end()
  ).catch(
    error => next(error)
  )
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const contactToUpdate = request.body
  Contact.findById(id)
    .then((contact) => {
      if (!contact) {
        return response.status(404).end()
      }
      contact.name = contactToUpdate.name
      contact.number = contactToUpdate.number

      contact.save({ runValidators: true }).then(
        updatedContact => response.json(updatedContact)
      ).catch(
        (error) => next(error)
      )
    }).catch(
      error => next(error)
    )
})

app.post('/api/persons', (request, response, next) => {
  const reqPerson = request.body
  Contact.insertOne({
    name: reqPerson.name,
    number: reqPerson.number
  }).then(
    insertedData => response.json(insertedData)
  ).catch(
    error => next(error)
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
      response.send(
        `Phonebook has info of ${countResult} people
        </br>
        ${dateString} (${timezone})`
      )
    }
  )
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server Started')
})