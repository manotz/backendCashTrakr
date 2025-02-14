"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decoded = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (id) => {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    });
    return token;
};
exports.generateJWT = generateJWT;
const decoded = (token) => {
    const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return decode;
};
exports.decoded = decoded;
//# sourceMappingURL=jwt.js.map