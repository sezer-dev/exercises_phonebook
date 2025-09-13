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

    app.get("/info", (request,response,next) => {
    Person.countDocuments({}) //Zählz die anzahl an doumenten
    .then(count => { //Ruckgabe ist die Anzahl 
      const info = `
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `;
      response.send(info);
    })
    .catch(error => next(error));

    })

    app.get("/api/persons/:id", (request,response) => {
         Person.findById(request.params.id).then(person => response.json(person));
    })

    app.delete("/api/persons/:id", (request,response,next) => {
        const id = request.params.id;
        Person.deleteOne({_id:id})
        .then(() => response.status(204).end())
        .catch(error => next(error));
       

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

        const person = new Person( {
            name:body.name,
            number:body.number
        })

        person.save().then(savedperson => response.json(savedperson));
        

    })

    const errorHanlder = (error,request,response,next) => {
        console.log(error.message)

        if(error.name ==='CastError'){
            return response.status(400).send({error:'malfornatted id'})
        }
        next(error);
    }

    app.use(errorHanlder);

    PORT = process.env.PORT

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
