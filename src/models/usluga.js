const mongoose = require('mongoose');
const validator = require('validator')
mongoose.pluralize(null);



let uslugaSchema = new mongoose.Schema({
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        require: true
    },
    opis: {
        type: String,
        trim: true,
        require: true
    },
    cijena: {
        type: Number,
        trim: true,
        require: true
    },
    trajanje:{
        type: Number,
        trim: true,
        require: true
    }
})


const Usluga = mongoose.model('Usluga', uslugaSchema)

module.exports = Usluga