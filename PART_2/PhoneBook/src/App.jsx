import { useState } from "react";

const App = () => {
 const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber]= useState('')
  const[filterName, setFilterName]= useState('')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('Form submitted. Current newName state:', newName)

    if (persons.some(person => person.name === newName)){
      alert(`${newName} is already added to Phonebook` )
      return
    }
    
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length +1
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
    console.log('successfuly added : ', (nameObject))
  }
  const handleFilteredChanges = (event) => {
    console.log('Searching for : ', event.target.value)
    setFilterName(event.target.value)
  }
  const personsToShow = filterName ===''
  ? persons
  : persons.filter(person => person.name.toLocaleLowerCase(). includes(filterName.toLocaleLowerCase()))

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

      <div>
        filter shown with <input value={filterName}  onChange={handleFilteredChanges}/>
      </div>
      <h3>add a new </h3>
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

      <h3>Numbers</h3>
      <ul>
        {personsToShow.map(person => 
          <li key={person.name}>{person.name} {person.number}</li>
        )}
      </ul>
    </div>
  )
}

export default App