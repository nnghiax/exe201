const nodemailler = require('nodemailer')
require('dotenv').config()

const sendMail = async ({
    email,
    subject,
    html
}) => {
    const transporter = nodemailler.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const message = {
        from: 'ADMIN FROM Hire Your Style',
        to: email,
        subject: subject,
        html: html
    }

    const result = await transporter.sendMail(message)
    return result;
}

module.exports = sendMail

