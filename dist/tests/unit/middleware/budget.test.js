"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const budget_1 = require("../../../middleware/budget");
const Budget_1 = __importDefault(require("../../../models/Budget"));
const budget_2 = require("../../mocks/budget");
jest.mock("../../../models/Budget", () => ({
    findByPk: jest.fn()
}));
describe("budget - validateBudgetExists", () => {
    it("Should handle non-existent budget", async () => {
        Budget_1.default.findByPk.mockResolvedValue(null);
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, budget_1.validateBudgetExists)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).not.toBe(401);
        expect(data).toEqual({ error: "Presupuesto no encontrado" });
        expect(next).not.toHaveBeenCalled();
    });
    it("Should proceed to next middleware if budget exists", async () => {
        Budget_1.default.findByPk.mockResolvedValue(budget_2.budgets[0]);
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, budget_1.validateBudgetExists)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.budget).toEqual(budget_2.budgets[0]);
    });
    it("Should go to catch if it have error", async () => {
        Budget_1.default.findByPk.mockRejectedValue(new Error);
        const req = (0, node_mocks_http_1.createRequest)({
            params: {
                budgetId: 1
            }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, budget_1.validateBudgetExists)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: "Hubo un error" });
        expect(next).not.toHaveBeenCalled();
    });
});
describe("budget - hasAccess", () => {
    it("Should return 401 error if userId doesn´t have access to budget", () => {
        const req = (0, node_mocks_http_1.createRequest)({
            budget: budget_2.budgets[0],
            user: { id: 2 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, budget_1.hasAccess)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: "Acción no válida" });
        expect(next).not.toHaveBeenCalled();
    });
    it("Should go to next function if user has the same id", () => {
        const req = (0, node_mocks_http_1.createRequest)({
            budget: budget_2.budgets[0],
            user: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, budget_1.hasAccess)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=budget.test.js.map