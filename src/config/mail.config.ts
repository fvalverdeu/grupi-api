import nodemailer from "nodemailer";
import fs from 'fs';

const mail = {
    user: 'upruebas112358@gmail.com',
    pass: 'tiahpycvsolxotrs'
}

export const sendMail = async (email: string, code: string) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: true,
        port: 465,
        auth: {
            user: mail.user,
            pass: mail.pass
        }
    });

    const imgData = fs.readFileSync('dist/assets/logo-email.png', { encoding: 'base64' });
    console.log('IMAGEN', imgData);

    await transporter.sendMail({
        from: mail.user,
        to: email,
        subject: 'Verificación de cuenta',
        text: 'Verificación de cuenta para registro',
        attachments: [{
            filename: 'logo-email.png',
            path: 'dist/assets/logo-email.png',
            cid: 'logo'
        }],
        html: `
            <head>
                <style>
                    #email___content {
                        background-color: #FFFFFF;
                    }
                    h1, h2, p {
                        color: #6F6F6F;
                        text-align: center;
                    }
                </style>
            </head>
            
            <div id="email___content" style="text-align: center;">
                <img height="128" width="300" src="cid:logo"/>
                <h1>Hola ${email}</h1>
                <h2>Gracias por registrarte...</h2>
                <br>
                <p style="font-size: 1.45rem;">¡Falta poco para que seas parte de la comunidad Grupi!</p>
                <p style="font-size: 1.45rem;">Para confirmar tu cuenta, ingresa el siguiente <b>código</b> en Grupi.</p>
                <p style="font-weight: bold; font-size: 3.5rem; color: #000000">${code}</p>
                <br><br>
            </div>
        `
    });
}