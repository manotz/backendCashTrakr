"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const AuthController_1 = require("../../../controllers/AuthController");
const User_1 = __importDefault(require("../../../models/User"));
const auth_1 = require("../../../utils/auth");
const token_1 = require("../../../utils/token");
const AuthEmail_1 = require("../../../emails/AuthEmail");
const jwt_1 = require("../../../utils/jwt");
jest.mock("../../../models/User"); // todas las funciones de User o del modelo se tiene cambia y ahora ya funciona
jest.mock("../../../utils/auth");
jest.mock("../../../utils/token");
jest.mock("../../../utils/jwt");
describe("AuthController.createAccount", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });
    it("should return a 409 status and an error message if the email is alredy registered", async () => {
        User_1.default.findOne.mockResolvedValue(true);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/auth/create-account",
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await AuthController_1.AuthController.createAccount(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(409);
        expect(data).toHaveProperty('error', 'El usuario con ese email ya esta registrado');
        expect(User_1.default.findOne).toHaveBeenCalledTimes(1);
    });
    it("Should register a new user and return and a success message", async () => {
        User_1.default.findOne.mockResolvedValue(null);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/auth/create-account",
            body: {
                email: 'test@test.com',
                password: 'testpassword',
                name: "testName"
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const mockUser = { ...req.body, save: jest.fn() };
        User_1.default.create.mockResolvedValue(mockUser);
        auth_1.hashPassword.mockResolvedValue("hashedpassword"); //funciones asincronas
        token_1.generateToken.mockReturnValue("123456"); //Para funciones sincronas
        jest.spyOn(AuthEmail_1.AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());
        await AuthController_1.AuthController.createAccount(req, res);
        const data = res._getJSONData();
        expect(User_1.default.create).toHaveBeenCalledWith(req.body);
        expect(data).toBe("Cuenta Creada Correctamente");
        expect(User_1.default.create).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
        expect(mockUser.password).toBe("hashedpassword");
        expect(mockUser.token).toBe("123456");
        expect(AuthEmail_1.AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: req.body.name,
            email: req.body.email,
            token: "123456"
        });
        expect(AuthEmail_1.AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
        expect(res.statusCode).toBe(201);
    });
});
describe("AuthController.login", () => {
    it("should return a 404 if user is not found", async () => {
        User_1.default.findOne.mockResolvedValue(null);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/auth/login",
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await AuthController_1.AuthController.login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Usuario no encontrado' });
    });
    it("should return a 403 if the account has not been confirmed", async () => {
        User_1.default.findOne.mockResolvedValue({
            id: 1,
            email: "test@test.com",
            password: "password",
            confirmed: false
        });
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/auth/login",
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await AuthController_1.AuthController.login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(403);
        expect(data).toEqual({ error: 'La cuenta no ha sido confirmada' });
    });
    it("should return a 401 if the password is incorrect", async () => {
        const userMock = {
            id: 1,
            email: "test@test.com",
            password: "password",
            confirmed: true
        };
        User_1.default.findOne.mockResolvedValue(userMock);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/auth/login",
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        auth_1.checkPassword.mockResolvedValue(false);
        await AuthController_1.AuthController.login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: 'Password incorrecto' });
        expect(auth_1.checkPassword).toHaveBeenCalledWith(req.body.password, userMock.password);
        expect(auth_1.checkPassword).toHaveBeenCalledTimes(1);
    });
    it("should return a JWT if authentication is successfull", async () => {
        const userMock = {
            id: 1,
            email: "test@test.com",
            password: "testpassword",
            confirmed: true
        };
        const fakejwt = "fake_jwt";
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/auth/login",
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        User_1.default.findOne.mockResolvedValue(userMock);
        auth_1.checkPassword.mockResolvedValue(true);
        jwt_1.generateJWT.mockReturnValue(fakejwt);
        await AuthController_1.AuthController.login(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(fakejwt);
        expect(jwt_1.generateJWT).toHaveBeenCalledTimes(1);
        expect(jwt_1.generateJWT).toHaveBeenCalledWith(userMock.id);
    });
});
//# sourceMappingURL=AuthController.test.js.map