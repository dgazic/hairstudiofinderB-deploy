const express = require('express');
const Usluga = require('../models/usluga')
const auth = require('../middleware/autentikacija')
const router = new express.Router();


router.get('/usluga/me', auth, async (req, res) =>{
    try {
        let usluge = await Usluga.find({salon: req.salon._id})
        console.log(usluge);
        res.status(201).send(usluge)
    } catch (error) {
        res.status(404).send(error)
    }
})
router.get('/usluga/:id', auth, async (req, res) =>{
    try {
        let usluge = await Usluga.find({salon: req.params.id})
        console.log(usluge);
        res.status(201).send(usluge)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post('/usluga', auth, async (req, res) =>{
    
    const usluga = new Usluga({
        ...req.body,
        salon: req.salon._id
        })

    try{
        await usluga.save()
        res.status(201).send(usluga)
    }catch(error){
        res.status(400).send(error)
    }
})

router.patch('/usluga/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['cijena']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'Nevažeća izmjena podataka'}) 
    }
    try{
        
        const usluga = await Usluga.findById(req.params.id)
        updates.forEach((update)=> usluga[update] = req.body[update])
        
       
        
    
        if(!usluga){
            return res.status(404).send()
        }
        await usluga.save()
        res.send(usluga)          
    }catch(error){
        res.status(400).send(error)
    }

})


router.delete('/usluga/:id', auth, async (req, res)=>{
    try{
        const usluga = await Usluga.findById({_id: req.params.id, salon: req.salon._id})
        if(!usluga){
            return res.status(404).send()
        }
        usluga.remove()
        res.send(usluga)
    }catch(error){
        console.log(error);
        res.status(500).send(error)
    }
})


module.exports = router