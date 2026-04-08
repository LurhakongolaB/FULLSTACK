import { useState } from "react";

const Filter =({value, onChange})=>{
  return (
    <div>
        filter shown with <input value={value}  onChange={onChange}/>
      </div>
  )


}
const PersonForm =(props)=>(
  <form onSubmit={props.addPerson}>
    <div>name: <input value={props.newName} onChange={props.handleNameChange} /></div>
    <div>number: <input value={props.newNumber} onChange={props.handleNumberChange} /></div>
    <div><button type="submit">add</button></div>
  </form>
)
const Persons=({personsToShow})=>(
    <ul>
        {personsToShow.map(person => 
          <li key={person.name}>{person.name} {person.number}</li>
        )}
      </ul>
)

const Person = ({person})=>(
  <li> {person.name} {person.number}</li>  
)


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
  const personsToShow = filterName ===''
  ? persons
  : persons.filter(person => person.name.toLocaleLowerCase(). includes(filterName.toLocaleLowerCase()))
 
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterName} onChange={(e)=>setFilterName(e.target.value)}/>

      
      <h3>add a new </h3>
      <PersonForm
      addPerson={addPerson}
      newName={newName}
      handleNameChange={(e) => setNewName(e.target.event)}
      newNumber={newNumber}
      handleNumberChange={(e)=> setNewNumber(e.target.value)}
      />
      

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow}/>
    
    </div>
  )
  }


export default App