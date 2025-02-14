"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const express_1 = __importDefault(require("express"));
const colors_1 = __importDefault(require("colors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db");
const budgetRouter_1 = __importDefault(require("./routers/budgetRouter"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
async function connectDB() {
    try {
        await db_1.db.authenticate(); //Crea la autenticacion y poder hacer operaciones
        db_1.db.sync(); // al momento de usar async se crea tablas y cambios que hagamos a las tablas
        console.log(colors_1.default.blue.bold("Conexión existosa a la BD"));
    }
    catch (error) {
        //console.log(error);
        console.log(colors_1.default.red.bold("Falló la conexión a la BD"));
    }
}
connectDB();
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use("/api/budgets", budgetRouter_1.default);
app.use("/api/auth", authRouter_1.default);
exports.default = app;
//# sourceMappingURL=server.js.map