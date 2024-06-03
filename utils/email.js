
const nodeMailer = require("nodemailer");


const sendEmail1 = async options => {
    let transporter = nodeMailer.createTransport({

        host: "smtp-mail.outlook.com",
        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK.PASSOWRD
        }
    })
    const mailOptions = {
        // from: "Eslam Amin <admin@social-network.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    }
    await transporter.sendMail(mailOptions);

}


const sendEmail = async options => {
    //Create a transporter
    const transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 25,
        auth: {
            user: process.env.MAILTRAP_EMAIL,
            pass: process.env.MAILTRAP_PASSWORD
        }
        // host: process.env.EMAIL_HOST,
        // port: process.env.EMAIL_PORT,
        // auth: {
        //     user: process.env.EMAIL,
        //     pass: process.env.PASSWORD
        // },
        // Activate in gmail "less secure app" option
        // service: "Gmail",
        // auth: {
        //     user: process.env.EMAIL,
        //     pass: process.env.PASSWORD
        // },
        //Activate in gmail "less secure app" option
    })

    //define email options
    const mailOptions = {
        from: "Eslam Amin <admin@social-network.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    }

    //send the mail
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;