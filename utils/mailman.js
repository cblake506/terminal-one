const sgMail = require('@sendgrid/mail')

const send = async (address, message) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: address, 
        from: 'noreplynotedepot@gmail.com',
        subject: 'A note has been shared',
        //text: message,
        html: message,
    };

    sgMail
    .send(msg)
    .then(() => {
    console.log('Email sent')
    })
    .catch((error) => {
    console.error(error)
    });
}
    

module.exports = {send};