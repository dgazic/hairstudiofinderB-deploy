const mongoose = require('mongoose');
const validator = require('validator')
mongoose.pluralize(null);
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Frizer = require('../models/frizer');


const salonSchema = new mongoose.Schema({
    ime: {
        type: String,
        required: true,
        trim: true
    },
    adresa: {
        type: String,
        required: true,
        trim: true
    },
    grad: {
        type: String,
        required: true,
        trim: true,
        
    },
    telefon:{
        type: Number,
        required: true,
        trim: true
    },
    oib: {
        type: Number,
        minLength: [11, 'OIB je nevažeći'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})


salonSchema.methods.toJSON = function () {
    const salon = this
    const salonObject = salon.toObject()

    delete salonObject.password
    delete salonObject.tokens

    return salonObject
}


salonSchema.methods.generateAuthToken = async function () {
    const salon = this
    const token = jwt.sign({ _id: salon._id.toString()}, process.env.JWT_SECRET)

    salon.tokens = salon.tokens.concat({ token: token })
    await salon.save()

    return token
}


salonSchema.statics.findByCredentials = async (email,password) => {
    const salon = await Salon.findOne({email})

    if(!salon){
        throw new Error('Login neuspješan!')
    }

    const isMatch = await bcrypt.compare(password, salon.password)

    if(!isMatch){
        throw new Error('Login neuspješan!')
    }

    return salon
}



//Hashiranje passworda prije save-anja
salonSchema.pre('save',async function(next) {
    const salon = this

    if(salon.isModified('password')){
        salon.password = await bcrypt.hash(salon.password, 8)
    }
    next()
})

salonSchema.pre('remove', async function(next){
    const salon = this
    await Frizer.deleteMany({vlasnik: salon._id})
    next()
})

const Salon = mongoose.model('Salon',salonSchema)

module.exports = Salon