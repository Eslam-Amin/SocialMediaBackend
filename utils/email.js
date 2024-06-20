
const nodeMailer = require("nodemailer");

const sendEmailGoogle = async options => {

    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, // secure = false => 587
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    // Email Options
    const mailOptions = {
        // from: `${process.env.APP_NAME} <MAIL>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };
    // Send email
    await transporter.sendMail(mailOptions);
}

//Outlook
const sendEmail = async options => {
    let transporter = nodeMailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,  // Port for TLS
        secure: false, // true for 465, false for other ports

        auth: {
            user: process.env.OUTLOOK_EMAIL,
            pass: process.env.OUTLOOK_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    })
    const mailOptions = {
        from: "Social Network Media <ea.eslamamin@outlook.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    }
    await transporter.sendMail(mailOptions);

}


const sendEmail1 = async options => {
    //Create a transporter
    const transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 25,
        auth: {
            user: process.env.MAILTRAP_EMAIL,
            pass: process.env.MAILTRAP_PASSWORD
        }

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