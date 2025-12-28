// JavaScript Document

import nodemailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "Neplatná data" });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"Web kontakt" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        replyTo: email,
        subject: "Nová zpráva z webu",
        text: `Jméno: ${name}\nEmail: ${email}\n\n${message}`
    });

    res.status(200).json({ success: true });
}