"use strict";
import nodemailer from "nodemailer"
import {env} from "../env/config.js"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service:'gmail',
    auth: {
        user: `${env.EMAIL}`,
        pass: `${env.PASSWORD}`
    }
});

export async function confirmAccount(userMail, token) {
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: `${userMail}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `${env.CONFIRM_ACCOUNT_PATH + token}`, // plain text body
        html: `${env.CONFIRM_ACCOUNT_PATH + token}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

export async function changePassword(userMail, token) {

    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: `${userMail}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `${env.CONFIRM_ACCOUNT_PATH + token}`, // plain text body
        html: `${env.CONFIRM_ACCOUNT_PATH + token}`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
