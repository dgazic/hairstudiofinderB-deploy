const mongoose = require('mongoose');
const validator = require('validator')
mongoose.pluralize(null);



const frizerSchema = new mongoose.Schema({
    vlasnik: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Salon'    
    },
    ime: {
        type: String,
        required: true,
        trim: true
    },
    prezime: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    telefon: {
        type: String,
        required: true
    }
})

const Frizer = mongoose.model('Frizer',frizerSchema)

module.exports = Frizer