import { useState, useEffect } from 'react'
import axios from 'axios'

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
    console.log('Effect: Sending Axios request to port 3001')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('Promise fulfilled: Data is here!')
        setPersons(response.data)
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

    axios
      .post('http://localhost:3001/persons', nameObject)
      .then(response => {
        console.log('POST request successful:', response.data)
        setPersons(persons.concat(response.data))
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