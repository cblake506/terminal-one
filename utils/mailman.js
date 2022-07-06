const sgMail = require('@sendgrid/mail')

const send = async (address, message) => {
    sgMail.setApiKey('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');

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