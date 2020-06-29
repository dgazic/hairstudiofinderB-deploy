const express = require('express');
const Korisnik = require('../models/korisnik')
const auth = require('../middleware/autentikacija')
const {posaljiWelcomeEmail, posaljiCancelationEmail} = require('../emails/acc')
const router = new express.Router();


router.get('/kojiuser', auth, async (req, res) =>{
    if(req.salon) return res.status(201).send({salon: req.salon, token: req.token})
    if(req.korisnik) return res.status(201).send({korisnik: req.korisnik, token: req.token})
})

router.post('/korisnici', async (req, res) => {
    const korisnik = new Korisnik(req.body);

    try{
        await korisnik.save()
        posaljiWelcomeEmail(korisnik.email,korisnik.ime)

        const token = await korisnik.generateAuthToken()

        res.status(201).send({korisnik,token})
    }catch(error){
        res.status(400).send(error)
    }
})
router.post('/korisnici/login', async(req, res) => {
    try{
        const korisnik = await Korisnik.findByCredentials(req.body.email, req.body.password)
        const token = await korisnik.generateAuthToken()
        res.send({korisnik, token})
    }catch(error){
        res.status(400).send()
    }
})

router.post('/korisnici/logout', auth, async (req, res) => {
    try{
        req.korisnik.tokens = req.korisnik.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.korisnik.save()

        res.send()
    }catch(error){
        res.status(500).send()
    }
})


router.get('/korisnici/me', auth ,async (req, res) => {
            res.send(req.korisnik)
})

router.patch('/korisnici/me', auth, async (req, res) => {
    console.log(req.body);
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ime','prezime','telefon','password']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    console.log(isValidOperation);
    if(!isValidOperation){
        return res.status(400).send({error: 'Nevažeća izmjena podataka'})
    }

    try{
        updates.forEach((update) => req.korisnik[update] = req.body[update])

         await req.korisnik.save()
        res.send(req.korisnik)
    }catch(error){
        res.status(400).send(error)
    }
})


router.delete('/korisnici/me',auth, async (req, res)=>{
    try{
        await req.korisnik.remove()
        res.send(req.korisnik)
        posaljiCancelationEmail( req.korisnik.email, req.korisnik.ime)
    }catch(error){
        res.status(500).send()        
    }
})


module.exports = router