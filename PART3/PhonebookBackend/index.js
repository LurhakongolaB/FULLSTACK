const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

// Morgan logging (with request body)
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// In-memory data
let persons = [
  { id: "1", name: "Saima Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
  { id: "5", name: "Marian", number: "39-21-6423127" },
  { id: "6", name: "Zaina", number: "39-21-6423127" }
]


app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Get one person
app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id)
  if (person) res.json(person)
  else res.status(404).end()
})

// Info route
app.get('/info', (req, res) => {
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// Delete person
app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(p => p.id !== req.params.id)
  res.status(204).end()
})

// Add person
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 100000).toString(),
    name,
    number
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})



// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})