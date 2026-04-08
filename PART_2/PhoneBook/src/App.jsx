import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' , number: '254 70547383'}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber]= useState('')

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
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
    console.log('successfuly added : ', (nameObject))
  }

  const handleNameChange = (event) => {
    console.log('Inputing name:', event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event)=>{
    console.log('Inputing number:', event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <ul>
        {persons.map(person => 
          <li key={person.name}>{person.name} {person.number}</li>
        )}
      </ul>
    </div>
  )
}

export default App