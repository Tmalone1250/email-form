var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const fs = require('fs');
const creds = require('./config');
const { error } = require('console');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', router);

//Transport configuration
var transport = {
    host: creds.HOST,
    port: creds.MAILPORT,
    auth: {
        user: creds.USER,
        pass: creds.PASS,
    },
    from: creds.EMAIL,
};

//Nodemailer transporter
var = transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take messages.');
    }
});

app.get('/', (req, res) => {
    res.json('hi');
});

router.post('/send', (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var message = req.body.message;
    var senderEmail = '${name} <${creds.EMAIL}>';
    var yourEmail = '${creds.YOURNAME} <$creds.EMAIL}>';
    var content = 'name: ${name} \n email: ${email} \n message: ${message}';
    var mail = {
        from: senderEmail,
        to: creds.EMAIL,
        subject: 'New Portfolio Message from ${name}',
        text: content,
    };

//Deliver message from you portfolio to your email address
    transport.sendMail(mail, (err, data) => {
        console.log(err);
        console.log(data);
        if (err) {
            res.json({
                status: 'fail',
            });
        } else {
            res.json({
                status: 'success',
            });

            //If success, send Auto Reply Email
            transporter.sendMail(
                {
                    from: yourEmail,
                    to: email,
                    subject: 'Message Received!',
                    text: 'Hi ${name}, \n Thank you for sending me an email. I will get back to you soon.\n\nBest Regards,\n${creds.YOURNAME}\n${creds.YOURSITE}\n\n\nMessage Details\nName: ${name}\n Email: ${email}\n Message: ${message}',
                    html: '<p>Hi ${name},<br>Thank you for sending me a message. I will get back to you soon.<br><br>Best Regards,<br>${creds.YOURNAME}<br>${creds.YOURSITE}<br><br><br>Message Details<br>Name: ${name}<br> Email: ${email}<br> Message: ${message}</p>',
                },
                function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Message Sent: ' + info.response);
                    }
                }
            );
        }
    });
});

const serverPort = 5000 //Server Port
app.listen(serverPort, () => console.log('backend is running on server port ${serverPort}'));