const express = require('express');
const Komentar = require('../models/komentar')
const auth = require('../middleware/autentikacija')
const router = new express.Router();


router.get('/komentari/:id_frizera', auth, async (req, res) =>{
    try {
        
        let komentari = await Komentar.find({frizer: req.params.id_frizera} || {korisnik: req.korisnik.username})
        console.log(komentari);
        res.status(201).send(komentari)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post('/komentari/frizer', auth, async (req, res) =>{
    
    const komentar = new Komentar({
        ...req.body,
        korisnik: req.korisnik.username
        })

    try{
        await komentar.save()
        res.status(201).send(komentar)
    }catch(error){
        res.status(400).send(error)
    }
})




module.exports = router