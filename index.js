const express = require('express');
var morgan = require('morgan')
const cors = require('cors')
const app = express();


let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(morgan('tiny'))
app.use(cors())

morgan.token('type', function (req, res) {
    if(req.method === "POST"){
        return JSON.stringify(req.body)
    }})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.json())

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((person) => person.id !== id)
    
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newBody = request.body
    newId = Math.floor(Math.random() * 100000)
    const newEntry = {
        id: newId,
        name: newBody.name,
        number: newBody.number
    }

    if(!newBody.name || !newBody.number){
        response.status(409).json({ error: 'name or numner field is empty'})
        return;
    }

    if(persons.find(person => person.name === newBody.name)){
        response.status(409).json({ error: 'name is already in phonebook'})
        return;
    }

    persons = persons.concat(newEntry);
    response(persons)
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});