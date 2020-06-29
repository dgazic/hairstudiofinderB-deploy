const mongoose = require('mongoose');
const validator = require('validator')
mongoose.pluralize(null);



let komentarSchema = new mongoose.Schema({
    salon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    frizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Frizer',
        required: true
    },
    korisnik: {
        type: String,
        required: true,
        trim: true
    },
    komentar: {
        type: String,
        trim: true,
        required: true
    },
    ocjena: {
        type: Number,
        trim: true,
        required: true
    }
})


const Komentar = mongoose.model('Komentar', komentarSchema)

module.exports = Komentar