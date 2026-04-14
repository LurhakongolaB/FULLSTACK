import { useState, useEffect } from 'react'
import personService from './services/persons'

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

const Persons = ({ personsToShow, deletePerson }) => (
  <ul>
    {personsToShow.map(person => 
      <li key={person.id}>
        {person.name} {person.number} {' '}
        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        console.log('Initial data loaded')
        setPersons(initialPersons)
      })
  }, []) 

  const addPerson = (event) => {
    event.preventDefault()
    
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            console.log('Update successful')
            setPersons(persons.map(person => 
              person.id !== existingPerson.id ? person : returnedPerson
            ))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const nameObject = { name: newName, number: newNumber }

    personService
      .create(nameObject)
      .then(returnedPerson => {
        console.log('Creation successful')
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          console.log(`Deleted person with id ${id}`)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
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
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App