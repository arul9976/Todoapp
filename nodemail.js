const nodemailer = require('nodemailer')


// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         user: 'arunmicheal8@gmail.com',
//         pass: 'qbkyyikdsszxnurw'
//     }
// });
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'arunmicheal8@gmail.com',
        pass: 'muohnboaccbwfpoq',
    }


});


const mailOptions = {
    from: 'hello@example.com',
    to: 'arulkumar72004@gmail.com',
    subject: 'Subject',
    text: 'Email content'
};
const SENDMAIL = async (mailOptions, callback) => {
    try {
        const info = await transporter.sendMail(mailOptions)
        callback(info);
    } catch (error) {
        console.log(error);
    }
};

SENDMAIL(mailOptions)


// const transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     secure: false,
//     requireTLS: true,
//     port: 2525,
//     auth: {
//         user: "a435583affc2e2",
//         pass: "e5c2879487d08a"
//     }
// });

// transporter.verify(function (error, success) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Server is ready');
//     }
// });

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('hi', error);
    } else {
        console.log('Email sent: ' + info.response);
        // do something useful
    }
});