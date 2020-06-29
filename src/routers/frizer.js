const express = require('express');
const Frizer = require('../models/frizer')
const auth = require('../middleware/autentikacija')
const router = new express.Router();


router.post('/frizeri', auth, async (req, res) => {
    const frizer = new Frizer({
        ...req.body,
        vlasnik: req.salon._id 
    });

    try{
        await frizer.save()
        res.status(201).send(frizer)
    }catch(error){
        res.status(400).send(error)
    }
})

router.get('/frizeri/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const frizer = await Frizer.findOne({_id, vlasnik: req.salon._id})

        if(!frizer) {
            return res.status(404).send({error: "Frizer nije pronaden"})
        }
        res.send(frizer)
    }catch(error){
        res.status(500).send(error)
    }
})
router.get('/frizeri/salon/:salon_id', auth, async (req, res) => {
    const _id = req.params.salon_id;
    try {
        const frizeri = await Frizer.find({vlasnik: _id})

        if(!frizeri) {
            return res.status(404).send({error: "Frizerinisu pronadeni"})
        }
        res.send(frizeri)
    }catch(error){
        res.status(500).send(error)
    }
})


router.patch('/frizeri/:id', auth, async (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    const updates = Object.keys(req.body)
    const allowedUpdates = ['ime','prezime','telefon']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'Nevažeća izmjena podataka'})
    }

    try{
        const frizer = await Frizer.findOne({_id: req.params.id, vlasnik: req.salon._id})
        updates.forEach((update) => frizer[update] = req.body[update])
        await frizer.save()
        if(!frizer){
            return res.status(404).send()
        }
        res.send(frizer)
    }catch(error){
        res.status(400).send(error)
    }
})


router.delete('/frizeri/:id',auth, async (req, res)=>{
    const _id = req.params.id
    try{
        const frizer = await Frizer.findById({_id, vlasnik: req.salon._id})
        if(!frizer){
            return res.send(404).send()
        }
        frizer.remove()
        res.send(frizer)
    }catch(error){
        res.status(500).send()        
    }
})


module.exports = router