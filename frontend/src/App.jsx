import { useState,useEffect } from 'react'
import axios from 'axios'
import noteService from './services/persons'


const Notification = ({message}) => {
  if(message===null){
    return null;
  }
  let col= 'red';
  if(message.includes(`Added`)){
    col = 'green';
  }

  const notstyle = {
    color:col,
    borderRadius:'5px',
    background:'lightgrey',
    fontSize:20,
    

  }
  return(<div style={notstyle}>
     {message}
  </div>)
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber,setNewNumber] = useState('');
  const [searchName,setSerchName] = useState('');
  const [notification,setNotification] = useState('');

  const hanldeNewName = (event) => {
    setNewName(event.target.value);
  }


  
 useEffect(() =>{ //Wird erst nachdem ersten rendern aufgerufen
    noteService.getAll()
      .then(person => {
        setPersons(person)
      });}
 ,[])


  const addPerson = (event) => {
    event.preventDefault();
    if(persons.map(p => p.name).includes(newName)){
      if(persons.map(p => p.number).includes(newNumber)){
        alert(`${newName} is already in phonebok`);
        return;
      }console.log("Here")
      //Nummer ändern:
     
      const pers = persons.find(p => p.name ===newName);
      if(!window.confirm(`${pers.name} is already in phonebook, replace old number with new one?`)){
        return;
      }
      noteService.put(pers.id,{...pers,number:newNumber})
      setPersons([...persons.filter(p => p.id != pers.id),{...pers,number:newNumber}])
        setNewName('');
     setNewNumber('');
      return;
    }
    const newperson = {name:newName, number:newNumber}
    noteService.post(newperson).then(person => {
    const finalperson = {name:newName, number:newNumber, id: person.data.id}
    setPersons([...persons,finalperson]);
    setNewName('');
    setNewNumber('');
    setNotification(`Added ${newName}`);
    setTimeout(() => setNotification(null),5000);
   });
  
  }

  const deltePerson = (id) => {
    console.log("ID:",id)
    if(!window.confirm(`Do you want to delte ${persons.find(p=> p.id===id).name}`)){
      return;
    };
    noteService.del(id).catch(error => 
      setNotification(`${persons.find((p)=>p.id===id).name} already deleted from server`));
      setTimeout(()=>setNotification(null),5000);
    setPersons(persons.filter( (p) => p.id!=id ));
  }


 

  return (
    <div>
      <Notification message={notification}/>
      <h2>Phonebook</h2>
      <form>
        <div>
          filter shown with <input value={searchName} onChange={(event) => setSerchName(event.target.value)}/>
        </div>
      </form>
      <form onSubmit={addPerson}>
        <h2>add a new</h2>
        <div>
          name: <input value={newName} onChange={hanldeNewName}/>
        </div>
        <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.filter((p)=> p.name.toLowerCase().includes(searchName.toLowerCase())).map((p,i) => 
      <p key={i}>{p.name} {p.number} <button onClick={() => deltePerson(p.id)}>delete</button></p>

    
    )}
    </div>
  )
}

export default App