const mongoose = require('mongoose');
const validator = require('validator')
mongoose.pluralize(null);



const terminSchema = new mongoose.Schema({
    korisnik: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Korisnik'
    },
    frizer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Frizer'
    },
    salon:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon'
    },
    title: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        trim: true
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }
})






const Termin = mongoose.model('Termin',terminSchema)

module.exports = Termin