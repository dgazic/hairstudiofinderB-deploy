const express = require('express');
const Salon = require('../models/salon')
const auth = require('../middleware/autentikacija')
const {posaljiWelcomeEmail, posaljiCancelationEmail} = require('../emails/acc')
const router = new express.Router();


router.get('/saloni',  async (req, res) =>{
    const match = {}
    console.log("serach", req.query.pretraga);
    if(req.query.pretraga != 'undefined' && req.query.pretraga != null){
        let searchTerm = new RegExp(`^.*${req.query.pretraga}.*$`, "img")
        match['$or'] = [{ime: searchTerm}, {grad: searchTerm}]
    }

    console.log("match", match);
    try {
        const saloni = await Salon.find(match)
        res.send(saloni)
    }catch (error) {
        res.status(500).send("Greška")
    }
})

router.post('/saloni/login', async(req, res) => {
    try{
        const salon = await Salon.findByCredentials(req.body.email, req.body.password)
        const token = await salon.generateAuthToken()
        res.send({salon, token})
    }catch(error){
        res.status(400).send()
    }
})

router.post('/saloni/logout', auth, async (req, res) => {
    try{
        req.salon.tokens = req.salon.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.salon.save()

        res.send()
    }catch(error){
        res.status(500).send()
    }
})
router.get('/saloni/:id', async (req, res) => {
    const _id = req.params.id

    try{
        const salon = await Salon.findById(_id)
        
        if(!salon){
            return res.status(404).send()
        }
        res.send(salon)
    }catch(error){
        res.status(500).send(error)
    }
})


router.post('/saloni', async (req, res) =>{
    const salon = new Salon(req.body)

    try{
        await salon.save()
        posaljiWelcomeEmail(salon.email,salon.ime)
        const token = await salon.generateAuthToken()
        res.status(201).send({salon,token})
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/salon/me', auth ,async (req, res) => {
    res.send(req.salon)
})

router.patch('/saloni/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ime', 'adresa', 'grad']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'Nevažeća izmjena podataka'}) 
    }
    try{
        
        const salon = await Salon.findById(req.params.id)
        updates.forEach((update)=> salon[update] = req.body[update])
        
        await salon.save()
        
    
        if(!salon){
            return res.status(404).send()
        }
        res.send(salon)          
    }catch(error){
        res.status(400).send(error)
    }

})


router.delete('/saloni/me',auth, async (req, res)=>{
    try{
        await req.salon.remove()
        res.send(req.salon)
        posaljiCancelationEmail( req.salon.email, req.salon.ime)
    }catch(error){
        res.status(500).send()        
    }
})


module.exports = router