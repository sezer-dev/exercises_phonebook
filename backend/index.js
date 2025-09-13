require('dotenv').config()
const express = require("express");
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('dist'))


var morgan = require('morgan')


morgan.token('body', req => JSON.stringify(req.body)) //Erzeuge neues Token

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    } ]

    app.get("/", (request,response) => {
        response.send('<h1>Telephone adresses API</h1>');
    })

    app.get("/api/persons", (request,response) => {
        Person.find({}).then(person => response.json(person));
    })

    app.get("/info", (request,response) => {
        info = `<p>Phonebook has info for ${Person.length} people</p>
                <p>${new Date()}</p>`
        response.send(info)

    })

    app.get("/api/persons/:id", (request,response) => {
        NodeIterator.findById(request.params.id).then(person => response.json(person));
    })

    app.delete("/api/persons/:id", (request,response) => {
        const id = request.params.id;
        persons = persons.filter(p => p.id!=id);
        response.status(204).end();

    })

    app.post("/api/persons", (request,response) => {

        const body = request.body;

        if(!body){
            return response.status(400).json({error:'content missing'})
        }
        if(!body.name||!body.number){
            return response.status(400).json({error:'data missing'})
        }
        if(persons.map(p=> p.name).includes(body.name)){
            return response.status(400).json({error:'name must be unique'})
        }

        const person = {
            id:String(Math.floor(Math.random()*100000)),
            name:body.name,
            number:body.number
        }
        persons = persons.concat(person)

        response.json(person)
        

    })

    PORT = 3001

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
