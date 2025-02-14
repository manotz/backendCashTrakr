import { transport } from "../config/nodemailer"

type EmailType = {
    name: string,
    email: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user : EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTrackr <admin@cashtrack.com>',
            to: user.email,
            subject: 'CashTrackr - Confirma tu cuenta',
            html:`
                <p>${user.name}, has creado tu cuenta en CashTrakr, ya esta casi lista</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                <p>e ingresa el código: <b>${user.token}</b></p>
            `
        })
    }

    static sendPasswordResetToken = async (user : EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTrackr <admin@cashtrack.com>',
            to: user.email,
            subject: 'CashTrackr - Reestablece tu password',
            html:`
                <p>${user.name}, has solicitado reestablecer tu password</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>e ingresa el código: <b>${user.token}</b></p>
            `
        })
    }
}