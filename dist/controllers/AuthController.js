"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        const { email, password } = req.body;
        //Prevenir duplicados
        const userExists = await User_1.default.findOne({
            where: {
                email
            }
        });
        if (userExists) {
            const error = new Error("El usuario con ese email ya esta registrado");
            res.status(409).json({ error: error.message });
            return;
        }
        try {
            const user = await User_1.default.create(req.body);
            user.password = await (0, auth_1.hashPassword)(password);
            const token = (0, token_1.generateToken)();
            user.token = token;
            if (process.env.NODE_ENV !== 'production') {
                globalThis.cashTrakrConfirmationToken = token;
            }
            user.confirmed = false;
            await user.save();
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            });
            res.status(201).json("Cuenta Creada Correctamente");
        }
        catch (error) {
            //console.log(error)
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static confirmAccount = async (req, res) => {
        const { token } = req.body;
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error('Token no válido');
            res.status(401).json({ error: error.message });
            return;
        }
        user.confirmed = true;
        user.token = null;
        await user.save();
        res.json("Cuenta Confirmada Correctamente");
    };
    static login = async (req, res) => {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            const error = new Error('Usuario no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        if (!user.confirmed) {
            const error = new Error('La cuenta no ha sido confirmada');
            res.status(403).json({ error: error.message });
            return;
        }
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Password incorrecto');
            res.status(401).json({ error: error.message });
            return;
        }
        const token = (0, jwt_1.generateJWT)(user.id);
        res.json(token);
    };
    static forgotPassword = async (req, res) => {
        const { email } = req.body;
        const user = await User_1.default.findOne({ where: { email } });
        if (!user) {
            const error = new Error('Usuario no encontrado');
            res.status(404).json({ error: error.message });
            return;
        }
        user.token = (0, token_1.generateToken)();
        await user.save();
        await AuthEmail_1.AuthEmail.sendPasswordResetToken({
            name: user.name,
            email: user.email,
            token: user.token
        });
        res.json("Revisa tu email para instrucciones y reestablecer tu password");
    };
    static validateToken = async (req, res) => {
        const { token } = req.body;
        const tokenExists = await User_1.default.findOne({ where: { token } });
        if (!tokenExists) {
            const error = new Error("Token no válido");
            res.status(404).json({ error: error.message });
            return;
        }
        res.json("Token válido, asigna un nuevo password");
    };
    static resetPasswordWithToken = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User_1.default.findOne({ where: { token } });
        if (!user) {
            const error = new Error("Token no válido");
            res.status(404).json({ error: error.message });
            return;
        }
        //Asignar password
        user.password = await (0, auth_1.hashPassword)(password);
        user.token = null;
        await user.save();
        res.json("El password se modificó correctamente");
    };
    static user = async (req, res) => {
        res.json(req.user);
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const { id } = req.user;
        const user = await User_1.default.findByPk(id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("El password actual no es correcto");
            res.status(401).json({ error: error.message });
            return;
        }
        user.password = await (0, auth_1.hashPassword)(password);
        await user.save();
        res.json("El password se modificó correctamente");
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const user = await User_1.default.findByPk(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error("El password no es correcto");
            res.status(401).json({ error: error.message });
            return;
        }
        res.json("Password Correcto");
    };
    static updateUserInformation = async (req, res) => {
        const { name, email } = req.body;
        try {
            const userExists = await User_1.default.findOne({
                where: {
                    email
                }
            });
            if (userExists && userExists.id !== req.user.id) {
                const error = new Error("Ese correo ya esta registrado por otro usuario");
                res.status(409).json({ error: error.message });
                return;
            }
            req.user.email = email;
            req.user.name = name;
            await User_1.default.update({ email, name }, {
                where: { id: req.user.id }
            });
            res.json("Perfil Actualizado Correctamente");
        }
        catch (e) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map