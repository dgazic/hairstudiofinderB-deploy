const sgMail = require('@sendgrid/mail')




sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const posaljiWelcomeEmail = (email, ime) => {
    sgMail.send({
        to: email,
        from: 'hairstudiofinder@net.hr',
        subject: 'Hvala za registraciju!',
        text: `Registracija je bila uspješna, ${ime}. Drago nam je da koristiš naše usluge!`
    })
}

const posaljiCancelationEmail = (email,ime) => {
    sgMail.send({
        to: email,
        from: 'hairstudiofinder@net.hr',
        subject: 'Žao nam je što odlazite!',
        text: `Doviđenja, ${ime}. Nadam se da ćeš nam se opet vratiti!`
    })
}

module.exports = {
    posaljiWelcomeEmail,posaljiCancelationEmail
}
