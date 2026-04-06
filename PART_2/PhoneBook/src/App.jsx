import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('Form submitted. Current newName state:', newName)

    const nameExists = persons.some(person=>person.name === newName)

    if (nameExists){
      console.log('Does name exist?', nameExists)
      alert(`${newName} is already added to Phonebook` )
      return
    }

    const nameObject = {
      name: newName
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    console.log('Updated persons list:', persons.concat(nameObject))
  }

  const handleNameChange = (event) => {
    console.log('Input value changing to:', event.target.value)
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(person => 
          <li key={person.name}>{person.name}</li>
        )}
      </ul>
    </div>
  )
}

export default App