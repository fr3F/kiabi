const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, htmlContent, attachment = [], cc = '') => {
    // const transporter = nodemailer.createTransport({
    //     host: "smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //         user: "155016f1c64688",
    //         pass: "867cfc91501668",
    //     },
    // });

    // const message = {
    //     from: "noreply@sodim.mg",
    //     to: email,
    //     subject: subject,
    //     html: htmlContent,
    // };

    const transporter = nodemailer.createTransport({
        host: "vwsr03.sodim.corp",
        port: 25,
        auth: {
            user: "ticket.appli@sodim.mg",
            pass: "tA!3136",
        },
    });

    let message = {
        from: "ticket.appli@sodim.mg",
        to: email,
        cc,
        subject: subject,
        html: htmlContent,
        attachments: attachment
    };

    await transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log("-----------------------------------");
            console.log(err);
        } else {
            // console.log(message)
        }
    });
};

module.exports = { sendEmail: sendEmail };
