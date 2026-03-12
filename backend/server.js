const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: 'https://beernardofrigeri.github.io'
}));
app.use(express.json());

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

app.post("/contato", async (req, res) => {
    const { nome, email, telefone, assunto, mensagem } = req.body;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'scaperifericos@gmail.com',
            replyTo: email,
            subject: `[SCA Periféricos] ${assunto}`,
            html: `
                <h2>Nova mensagem pelo site</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>E-mail:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Assunto:</strong> ${assunto}</p>
                <p><strong>Mensagem:</strong> ${mensagem}</p>
            `,
        });

        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, erro: err.message });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});