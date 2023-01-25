const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://ready:${password}@cluster0.tmyi4gg.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    important: Boolean,
})

const Person = mongoose.model('Person', personSchema)
const person = new Person({
    name: name,
    number: number,
    important: true,
})

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}
if (process.argv.length<4) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length == 5) {
    person.save().then(result => {
        console.log(`${name} ${number} has been added to the phonebook`)
        mongoose.connection.close()})
}