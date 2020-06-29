const jwt = require('jsonwebtoken')
const Korisnik = require('../models/korisnik')
const Salon = require('../models/salon')


const auth = async (req,res,next) => {
    try{
        // console.log(req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const korisnik = await Korisnik.findOne({ _id: decoded._id, 'tokens.token': token })
        const salon = await Salon.findOne({_id: decoded._id, 'tokens.token': token})

        if(!korisnik && !salon){
            throw new Error('Autentikacija neuspjesna!')
        }
        if(korisnik){
            req.token = token
            req.korisnik = korisnik
            next()
        }
        if(salon){
            req.token = token
            req.salon = salon
            next()
        }
    }catch(error){
        res.status(401).send({error: 'Autentikacija neuspjesna'})
    }

}


module.exports = auth