import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './component/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    console.log('Effect hook: Fetching initial data...')
    personService.getAll().then(initialPersons => {
      console.log('Server response: Data loaded', initialPersons)
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log('Form submitted: Attempting to add', newName)

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      console.log('Duplicate detected:', existingPerson)
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        console.log('User confirmed update for ID:', existingPerson.id)
        const changedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            console.log('Update successful:', returnedPerson)
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            
            setMessageType('success')
            setInfoMessage(`Updated number for ${newName}`)
            setTimeout(() => setInfoMessage(null), 5000)
            
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.error('Update failed: Person likely removed from server', error)
            setMessageType('error')
            setInfoMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => setInfoMessage(null), 5000)
            
            console.log('Cleaning up local state for ID:', existingPerson.id)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return 
    }

    const nameObject = { name: newName, number: newNumber }
    console.log('Creating new entry:', nameObject)

    personService.create(nameObject).then(returnedPerson => {
      console.log('Creation successful:', returnedPerson)
      setPersons(persons.concat(returnedPerson))
      
      setMessageType('success')
      setInfoMessage(`Added ${newName}`)
      setTimeout(() => setInfoMessage(null), 5000)
      
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (id, name) => {
    console.log('Delete requested for:', name, 'ID:', id)
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then(() => {
        console.log('Delete successful on server')
        setPersons(persons.filter(p => p.id !== id))
        
        setMessageType('success')
        setInfoMessage(`Deleted ${name}`)
        setTimeout(() => setInfoMessage(null), 5000)
      })
    }
  }

  const handleNameChange = (e) => {
    console.log('Name input change:', e.target.value)
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    console.log('Number input change:', e.target.value)
    setNewNumber(e.target.value)
  }

  const personsToShow = filterName === ''
    ? persons
    : persons.filter(p => {
        const matches = p.name.toLowerCase().includes(filterName.toLowerCase())
        return matches
      })

  console.log('Rendering component. Persons count:', personsToShow.length)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} type={messageType} />
      
      <div>
        filter shown with 
        <input 
          value={filterName} 
          onChange={(e) => {
            console.log('Filter change:', e.target.value)
            setFilterName(e.target.value)
          }} 
        />
      </div>
      
      <h3>Add a new</h3>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <div><button type="submit">add</button></div>
      </form>

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(person => 
          <li key={person.id}>
            {person.name} {person.number} 
            <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default App