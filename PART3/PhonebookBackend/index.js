require('dotenv').config()
const express = require('express')
const Person = require('./models/persons')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors') // 1. Added CORS
const app = express()
app.use(cors()) // 2. Enable CORS
app.use(express.json())
app.use(express.static(path.join(__dirname, 'dist')))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const url = process.env.MONGODB_URI
console.log('connecting to', url)
if (!url) {
  console.error('MONGODB_URI is not defined in environment variables')
  process.exit(1)
}

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    next(error)
  }
})


app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id)
  if (person) res.json(person)
  else res.status(404).end()
})



app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})
// ######################################################################

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  // Debugging line
  console.log('DEBUG: Received body:', body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})













// ##############################################################
// app.post('/api/persons', (req, res) => {
//   const { name, number } = req.body
//   if (!name || !number) {
//     return res.status(400).json({ error: 'name or number missing' })
//   }
//   if (persons.find(p => p.name === name)) {
//     return res.status(400).json({ error: 'name must be unique' })
//   }
//   const newPerson = {
//     id: Math.floor(Math.random() * 100000).toString(),
//     name,
//     number
//   }
//   persons = persons.concat(newPerson)
//   res.json(newPerson)
// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})