const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const numberValidator = [{
    validator: (number) => {
        if (number.length < 9){
            return false
        }
        return true
    },
    message: 'phonenumber needs to bee atleast 8 digits',
},
{
    validator: (number) => {
        return /^\d{2,3}-\d+$/.test(number)
    },
    message: props => `${props.value} is not a valid phone number!`
}]

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlenght: 3,
    },
    number: {
        type: String,
        validate: numberValidator,
        required: true,
    },
})  

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('person', personSchema)