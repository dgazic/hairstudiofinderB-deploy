const mongoose = require('mongoose');
const validator = require('validator')
mongoose.pluralize(null);
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const korisnikSchema = new mongoose.Schema({
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
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email je nevažeći')
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Unesite lozinku'],
        trim : true,
        minlength: [8, 'Lozinka je prekratka']
    },
    username: {
        type: String,
        required: [true, 'Unesite username'],
        trim : true,
        lowercase: true,
        minLength: [3, 'Username je prekratak'],

    },
    telefon: {
        type: Number,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


korisnikSchema.methods.toJSON = function () {
    const korisnik = this
    const korisnikObject = korisnik.toObject()

    delete korisnikObject.password
    delete korisnikObject.tokens

    return korisnikObject
}


korisnikSchema.methods.generateAuthToken = async function () {
    const korisnik = this
    const token = jwt.sign({ _id: korisnik._id.toString()}, process.env.JWT_SECRET )

    korisnik.tokens = korisnik.tokens.concat({ token: token })
    await korisnik.save()

    return token
}


korisnikSchema.statics.findByCredentials = async (email,password) => {
    const korisnik = await Korisnik.findOne({email})

    if(!korisnik){
        throw new Error('Login neuspješan!')
    }

    const isMatch = await bcrypt.compare(password, korisnik.password)

    if(!isMatch){
        throw new Error('Login neuspješan!')
    }

    return korisnik
}



//Hashiranje passworda prije save-anja
korisnikSchema.pre('save',async function(next) {
    const korisnik = this

    if(korisnik.isModified('password')){
        korisnik.password = await bcrypt.hash(korisnik.password, 8)
    }
    next()
})

const Korisnik = mongoose.model('Korisnik', korisnikSchema )

module.exports = Korisnik