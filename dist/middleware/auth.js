"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error("No Autorizado");
        res.status(401).json({ error: error.message });
        return;
    }
    const [, token] = bearer.split(" ");
    if (!token) {
        const error = new Error("token no válido");
        res.status(401).json({ error: error.message });
        return;
    }
    try {
        const respuesta = (0, jwt_1.decoded)(token);
        if (typeof respuesta === "object" && respuesta.id) {
            const user = await User_1.default.findByPk(respuesta.id, {
                attributes: ['id', 'name', 'email']
            });
            req.user = user;
            next();
        }
    }
    catch (error) {
        res.status(500).json({ error: "Token no válido" });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map