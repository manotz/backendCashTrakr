"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const expense_1 = require("../../../middleware/expense");
const Expense_1 = __importDefault(require("../../../models/Expense"));
const expense_2 = require("../../mocks/expense");
const budget_1 = require("../../../middleware/budget");
const budget_2 = require("../../mocks/budget");
jest.mock("../../../models/Expense", () => ({
    findByPk: jest.fn()
}));
describe("Expenses Middleware - validateExpenseExists", () => {
    beforeEach(() => {
        Expense_1.default.findByPk.mockImplementation((id) => {
            const expense = expense_2.expenses.filter(ex => ex.id === id)[0] ?? null;
            return Promise.resolve(expense);
        });
    });
    it("Should handle a non-existent budget", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expenseId: 120 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.validateExpenseExists)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: "Gasto no encontrado" });
        expect(next).not.toHaveBeenCalled();
    });
    it("Should call net middleware if expense exists", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expenseId: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.validateExpenseExists)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.expense).toEqual(expense_2.expenses[0]);
    });
    it("Should handle internal serve error", async () => {
        Expense_1.default.findByPk.mockRejectedValue(new Error);
        const req = (0, node_mocks_http_1.createRequest)({
            params: { expenseId: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        await (0, expense_1.validateExpenseExists)(req, res, next);
        const data = res._getJSONData();
        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'hubo un error' });
    });
    it("Should prevent unauthorized users form adding expenses", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets/:budgetId/expenses",
            budget: budget_2.budgets[0],
            user: { id: 20 },
            body: { name: "Expense Test", amount: 3000 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        const next = jest.fn();
        (0, budget_1.hasAccess)(req, res, next);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: "Acción no válida" });
        expect(next).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=expense.test.js.map