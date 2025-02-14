"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
class AuthEmail {
    static sendConfirmationEmail = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: 'CashTrackr <admin@cashtrack.com>',
            to: user.email,
            subject: 'CashTrackr - Confirma tu cuenta',
            html: `
                <p>${user.name}, has creado tu cuenta en CashTrakr, ya esta casi lista</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                <p>e ingresa el código: <b>${user.token}</b></p>
            `
        });
    };
    static sendPasswordResetToken = async (user) => {
        const email = await nodemailer_1.transport.sendMail({
            from: 'CashTrackr <admin@cashtrack.com>',
            to: user.email,
            subject: 'CashTrackr - Reestablece tu password',
            html: `
                <p>${user.name}, has solicitado reestablecer tu password</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>e ingresa el código: <b>${user.token}</b></p>
            `
        });
    };
}
exports.AuthEmail = AuthEmail;
//# sourceMappingURL=AuthEmail.js.map