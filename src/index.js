import './db/mongoose.js'
const express = require('express');
import cors from 'cors'
const korisnikRouter = require('./routers/korisnik')
const salonRouter = require('./routers/salon')
const terminRouter = require('./routers/termin')
const frizerRouter = require('./routers/frizer')
const uslugaRouter = require('./routers/usluga')
const komentarRouter = require('./routers/komentar')




const app = express();
const port = process.env.PORT;



app.use(cors())
app.use(express.json())
app.use(korisnikRouter)
app.use(salonRouter)
app.use(terminRouter)
app.use(frizerRouter)
app.use(uslugaRouter)
app.use(komentarRouter)



app.listen(port, () => {
    console.log('Server je na portu ' + port)
})

