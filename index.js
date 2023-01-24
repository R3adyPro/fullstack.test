require('dotenv').config()
const express = require('express');
var morgan = require('morgan')
const cors = require('cors')
const app = express();
const Person = require('./models/person')

app.use(morgan('tiny'))
app.use(cors())

morgan.token('type', function (req, res) {
    if(req.method === "POST"){
        return JSON.stringify(req.body)
    }})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.json())

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person);
    })
});

app.get(`/api/persons/:id`, (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
});

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = new Person({
    name: body.name,
    number: body.number,
    })

    if(!body.name || !body.number){
        return response.status(409).json({ error: 'name or numner field is empty'})
    }

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${Person.length -1} people</p> <p>${new Date()}</p>`)
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});