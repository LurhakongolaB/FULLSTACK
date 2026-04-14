import { useState, useEffect } from 'react'
import personService from './services/persons' // Import the service

const Filter = ({ value, onChange }) => (
  <div>
    filter shown with <input value={value} onChange={onChange} />
  </div>
)

const PersonForm = (props) => (
  <form onSubmit={props.addPerson}>
    <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)

const Persons = ({ personsToShow }) => (
  <ul>
    {personsToShow.map(person => 
      <li key={person.id}>{person.name} {person.number}</li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    console.log('Effect: Fetching initial data')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('Data fetched successfully')
        setPersons(initialPersons)
      })
  }, []) 

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        console.log('New person added to server')
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)

  const personsToShow = filterName === ''
    ? persons
    : persons.filter(person => 
        person.name.toLowerCase().includes(filterName.toLowerCase())
      )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterName} onChange={(e) => setFilterName(e.target.value)} />
      
      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App