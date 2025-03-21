const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static("dist"))
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  return Math.random().toString(36).substring(2, 7)
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let reqPerson = request.body
  if (reqPerson.name && reqPerson.number) {
    if (persons.find(p => reqPerson.name === p.name)) {
      response.status(409).json({error: `The name ${reqPerson.name} already exists`})
    }
    reqPerson = {...reqPerson, id: generateId()}
    persons = persons.concat(reqPerson)
    response.json(reqPerson)
  } else {
    response.status(400).end()
  }
})

app.get('/info', (request, response) => {
  const nPersons = persons.length
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
  response.send(
    `Phonebook has info of ${nPersons} people
    </br>
    ${dateString} (${timezone})`
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