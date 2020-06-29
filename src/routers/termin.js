const express = require('express');
const Termin = require('../models/termin')
const auth = require('../middleware/autentikacija')
const router = new express.Router()


router.get('/termini',auth,  async (req, res) =>{
    
    try {
        const termini = await Termin.find({})
        res.send(termini)
    }catch (error) {
        res.status(500).send()
    }
})

router.get('/termini/frizer/:id', async (req, res) => {
    const _id = req.params.id
    const match = {frizer: _id}

    if(req.query.datum != 'undefined' && req.query.datum != null){
        var result = new Date(req.query.datum);
        result.setDate(result.getDate() + 1);
        match['$and'] = [
            {start: {$gt: req.query.datum}},
            {end: {$lt: result}}, 
            {content: { $exists: false}}
        ]
    }
    //console.log(match);
     try{
        const termin = await Termin.find(match)
         console.log(termin);
        if(!termin){
             return res.status(404).send()
         }
        res.send(termin)
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/termini/salon/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const termin = await Termin.find({salon: _id})
        
        if(!termin){
            return res.status(404).send()
        }
        res.send(termin)
    }catch(error){
        res.status(500).send(error)
    }
})


router.post('/termini', auth, async (req, res) =>{
    console.log(req.body);
    const termin = new Termin({
        ...req.body       
    })
    try{
        await termin.save()
        res.status(201).send(termin)
    }catch(error){
        res.status(400).send(error)
    }
})



router.patch('/termini/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['start', 'end', 'title', 'content', 'salon']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'Nevažeća izmjena podataka'}) 
    }
    try{
        
        const termin = await Termin.findById(req.params.id)
        updates.forEach((update)=> termin[update] = req.body[update])
        
        if(!termin){
            return res.status(404).send()
        }
        await termin.save()
        res.send(termin)          
    }catch(error){
        res.status(400).send(error)
    }

})


router.delete('/termini/:id', async (req, res)=>{
    const _id = req.params.id
    try{
        const termin = await Termin.findById(_id)

        if(!termin){
            return res.status(404).send()
        }
        termin.remove()
        res.send(termin)
    }catch(error){
        res.status(500).send()
    }
})


module.exports = router