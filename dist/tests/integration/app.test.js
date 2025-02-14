"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const AuthController_1 = require("../../controllers/AuthController");
const User_1 = __importDefault(require("../../models/User"));
const authUtils = __importStar(require("../../utils/auth"));
const jwtUtils = __importStar(require("../../utils/jwt"));
describe("Authentication - Create Account", () => {
    it("Should display validation errors when form is empty", async () => {
        const response = (await (0, supertest_1.default)(server_1.default).post("/api/auth/create-account").send({}));
        const createAccountMock = jest.spyOn(AuthController_1.AuthController, 'createAccount');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(3);
        expect(response.status).not.toBe(201);
        expect(response.body.errors).not.toHaveLength(2);
        expect(createAccountMock).not.toHaveBeenCalled();
    });
    it("Should return 400 when the email is invalid", async () => {
        const response = (await (0, supertest_1.default)(server_1.default).post("/api/auth/create-account").send({ "name": "Emmanuel", "password": "12345678", "email": "not_valid_email" }));
        const createAccountMock = jest.spyOn(AuthController_1.AuthController, 'createAccount');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors[0].msg).toBe("Email no válido");
        expect(response.body.errors).toHaveLength(1);
        expect(response.status).not.toBe(201);
        expect(response.body.errors).not.toHaveLength(2);
        expect(response.body.errors).not.toHaveLength(3);
        expect(createAccountMock).not.toHaveBeenCalled();
    });
    it("Should return 400 when the length of the password and email is invalid", async () => {
        const response = (await (0, supertest_1.default)(server_1.default).post("/api/auth/create-account").send({ "name": "Emmanuel", "password": "1234", "email": "not_valid_email" }));
        const createAccountMock = jest.spyOn(AuthController_1.AuthController, 'createAccount');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(2);
        expect(response.status).not.toBe(201);
        expect(response.body.errors).not.toHaveLength(1);
        expect(response.body.errors).not.toHaveLength(3);
        expect(createAccountMock).not.toHaveBeenCalled();
    });
    it("Should return 400 when the length of the password and is invalid", async () => {
        const response = (await (0, supertest_1.default)(server_1.default).post("/api/auth/create-account").send({ "name": "Emmanuel", "password": "1234", "email": "test@test.com" }));
        const createAccountMock = jest.spyOn(AuthController_1.AuthController, 'createAccount');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("El password es muy corto mínimo 8 caracteres");
        expect(response.status).not.toBe(201);
        expect(response.body.errors).not.toHaveLength(2);
        expect(response.body.errors).not.toHaveLength(3);
        expect(createAccountMock).not.toHaveBeenCalled();
    });
    it("Should register a new user successfully", async () => {
        const userData = {
            "name": "Emmanuel",
            "password": "12345678",
            "email": "test@test.com"
        };
        const response = (await (0, supertest_1.default)(server_1.default).post("/api/auth/create-account").send(userData));
        expect(response.status).toBe(201);
        expect(response.body).not.toHaveProperty("errors");
    });
    it("Should return 409 confict when an user is already register", async () => {
        const userData = {
            "name": "Emmanuel",
            "password": "12345678",
            "email": "test@test.com"
        };
        const response = (await (0, supertest_1.default)(server_1.default).post("/api/auth/create-account").send(userData));
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe("El usuario con ese email ya esta registrado");
        expect(response.status).not.toBe(400);
        expect(response.status).not.toBe(201);
        expect(response.body).not.toHaveProperty("errors");
    });
});
describe("Authentication - Account Confirmation with Token", () => {
    it("Should display error if token is empty or token is not valid", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/confirm-account").send({ token: "not_valid" });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Token no válido');
    });
    it("Should display error if token doesnt exists", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/confirm-account").send({ token: "123456" });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe('Token no válido');
        expect(response.status).not.toBe(200);
    });
    it("Should Confirm accoutn with a valid token", async () => {
        const token = globalThis.cashTrakrConfirmationToken;
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/confirm-account").send({ token });
        expect(response.status).toBe(200);
        expect(response.body).toBe("Cuenta Confirmada Correctamente");
        expect(response.status).not.toBe(400);
        expect(response.status).not.toBe(401);
    });
});
describe('Authentication - Login', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("Should display validation errors when the form is empty", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({});
        const loginMock = jest.spyOn(AuthController_1.AuthController, "login");
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(2);
        expect(response.body.errors).not.toHaveLength(1);
        expect(response.body.errors).not.toHaveLength(3);
        expect(loginMock).not.toHaveBeenCalled();
    });
    it("Should return 400 bad requests when the email is invalid", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({ "password": "password", "email": "not_valid" });
        const loginMock = jest.spyOn(AuthController_1.AuthController, "login");
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("Email no válido");
        expect(response.body.errors).not.toHaveLength(2);
        expect(response.body.errors).not.toHaveLength(3);
        expect(loginMock).not.toHaveBeenCalled();
    });
    it("Should return 404 user not found when the email is not finded", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({ "password": "password", "email": "correo3@test.com" });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
        expect(response.body).toEqual({ error: 'Usuario no encontrado' });
        expect(response.status).not.toBe(201);
    });
    it("Should return 403 error if the user account is not confirmed", async () => {
        jest.spyOn(User_1.default, 'findOne')
            .mockResolvedValue({
            id: 1,
            confirmed: false,
            password: "hashedPassword",
            email: "correo5@correo.com"
        });
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({ "password": "password", "email": "correo3@test.com" });
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe('La cuenta no ha sido confirmada');
        expect(response.status).not.toBe(201);
        expect(response.status).not.toBe(20);
        expect(response.status).not.toBe(404);
    });
    it("Should return 403 error if the user account is not confirmed", async () => {
        const userDAta = {
            name: "Test",
            password: "password",
            email: "correo3@test.com"
        };
        await (0, supertest_1.default)(server_1.default).post("/api/auth/create-account").send(userDAta);
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({ "password": userDAta.password, "email": userDAta.email });
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe('La cuenta no ha sido confirmada');
        expect(response.status).not.toBe(201);
        expect(response.status).not.toBe(20);
        expect(response.status).not.toBe(404);
    });
    it("Should return 401 error if the password is incorrect", async () => {
        const findOne = jest.spyOn(User_1.default, 'findOne')
            .mockResolvedValue({
            id: 1,
            confirmed: true,
            password: "hashedPassword",
        });
        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false);
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({ "password": "passwordwrong", "email": "correo3@test.com" });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe('Password incorrecto');
        expect(response.status).not.toBe(201);
        expect(response.status).not.toBe(20);
        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(403);
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledTimes(1);
    });
    it("Should return jwt if all its okey", async () => {
        const findOne = jest.spyOn(User_1.default, 'findOne')
            .mockResolvedValue({
            id: 1,
            confirmed: true,
            password: "hashPassword",
        });
        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true);
        const generateJWT = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue('jwt_token');
        const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({ "password": "correctPassword", "email": "correo3@test.com" });
        expect(response.body).toEqual('jwt_token');
        expect(findOne).toHaveBeenCalled();
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalled();
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith("correctPassword", "hashPassword");
        expect(generateJWT).toHaveBeenCalled();
        expect(generateJWT).toHaveBeenCalledTimes(1);
        expect(generateJWT).toHaveBeenCalledWith(1);
    });
});
let jwt;
async function autheticateUser() {
    const response = await (0, supertest_1.default)(server_1.default).post("/api/auth/login").send({
        email: "test@test.com",
        password: "12345678"
    });
    jwt = response.body;
    expect(response.status).toBe(200);
}
describe('GET /api/budgets', () => {
    beforeAll(() => {
        jest.restoreAllMocks();
    });
    beforeAll(async () => {
        await autheticateUser();
    });
    it("Should reject unauthenticated access to budget without a jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).get("/api/budgets");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
    });
    it("Should reject unauthenticated access to budget without a valid jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).get("/api/budgets").auth('not_valid', { type: 'bearer' });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Token no válido");
    });
    it("Should allow autheticated access to budgets with a valid jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).get("/api/budgets").auth(jwt, { type: 'bearer' });
        expect(response.body).toHaveLength(0);
        expect(response.status).not.toBe(401);
        expect(response.body.error).not.toBe("No Autorizado");
    });
});
describe('POST /api/budgets', () => {
    beforeAll(async () => {
        await autheticateUser();
    });
    it("Should reject unauthenticated post request to budget without a jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/budgets");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
    });
    it("Should display validation when form is submitted empty or invalid data", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/budgets").auth(jwt, { type: 'bearer' }).send({});
        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveLength(4);
        expect(response.status).not.toBe(401);
    });
    it("Should create a budget correctly when all data is valid", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/budgets").auth(jwt, { type: 'bearer' }).send({ "name": "PC Gamer", "amount": 3000 });
        expect(response.status).toBe(201);
        expect(response.body).toBe("Presupuesto Creado Correctamente");
        expect(response.status).not.toBe(401);
    });
});
describe("GET /api/budgets/:id", () => {
    beforeAll(async () => {
        await autheticateUser();
    });
    it("Should reject unauthenticated get request to budget id without a jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/budgets/1");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
    });
    it("Should reject unauthenticated get request to budget id without a jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).post("/api/budgets/1");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
    });
    it("Should return 400 bad request when id is not valid", async () => {
        const response = await (0, supertest_1.default)(server_1.default).get("/api/budgets/not_valid").auth(jwt, { type: 'bearer' });
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe("id no válido");
        expect(response.status).not.toBe(401);
        expect(response.body.error).not.toBe("No Autorizado");
    });
    it("Should return 404 not found when a budget doesnt exists", async () => {
        const response = await (0, supertest_1.default)(server_1.default).get("/api/budgets/3000").auth(jwt, { type: 'bearer' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Presupuesto no encontrado');
        expect(response.status).not.toBe(401);
        expect(response.status).not.toBe(400);
    });
    it("Should return a sigle budget by id", async () => {
        const response = await (0, supertest_1.default)(server_1.default).get("/api/budgets/1").auth(jwt, { type: 'bearer' });
        expect(response.status).toBe(200);
        expect(response.status).not.toBe(401);
        expect(response.status).not.toBe(400);
        expect(response.status).not.toBe(404);
    });
});
describe('PUT /api/budgets/:id', () => {
    beforeAll(async () => {
        await autheticateUser();
    });
    it("Should reject unauthenticated put request to budget id without a jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).put("/api/budgets/1");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
    });
    it("Should display validation errors if the form is empty", async () => {
        const response = await (0, supertest_1.default)(server_1.default).put("/api/budgets/1").auth(jwt, { type: "bearer" }).send({});
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(4);
    });
    it("Should update a budget by id and return success message", async () => {
        const response = await (0, supertest_1.default)(server_1.default).put("/api/budgets/1").auth(jwt, { type: "bearer" }).send({
            name: "Update Budget",
            amount: 4000
        });
        expect(response.status).toBe(200);
        expect(response.body).toBe("Presupuesto Actualizado Correctamente");
    });
});
describe('DELETE /api/budgets/:id', () => {
    beforeAll(async () => {
        await autheticateUser();
    });
    it("Should reject unauthenticated put request to budget id without a jwt", async () => {
        const response = await (0, supertest_1.default)(server_1.default).delete("/api/budgets/1");
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("No Autorizado");
    });
    it("Should return 404 not found when a budget doest exists ", async () => {
        const response = await (0, supertest_1.default)(server_1.default).delete("/api/budgets/3000").auth(jwt, { type: "bearer" });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Presupuesto no encontrado');
    });
    it("Should update a budget by id and return success message", async () => {
        const response = await (0, supertest_1.default)(server_1.default).delete("/api/budgets/1").auth(jwt, { type: "bearer" });
        expect(response.status).toBe(200);
        expect(response.body).toBe("Presupuesto Eliminado Correctamente");
    });
});
//# sourceMappingURL=app.test.js.map