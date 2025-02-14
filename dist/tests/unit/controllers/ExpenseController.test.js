"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const Expense_1 = __importDefault(require("../../../models/Expense"));
const ExpenseController_1 = require("../../../controllers/ExpenseController");
const expense_1 = require("../../mocks/expense");
jest.mock("../../../models/Expense", () => ({
    create: jest.fn()
}));
describe("ExpenseController.create", () => {
    it("Should create a new expense", async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };
        Expense_1.default.create.mockResolvedValue(expenseMock);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets/:budgetId/expenses",
            body: { name: "Test Expense", amount: 500 },
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.create(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(201);
        expect(data).toEqual("Gasto Agregado Correctamente");
        expect(expenseMock.save).toHaveBeenCalled();
        expect(expenseMock.save).toHaveBeenCalledTimes(1);
        expect(Expense_1.default.create).toHaveBeenCalledWith(req.body);
    });
    it("Should handle expense creation error ", async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };
        Expense_1.default.create.mockRejectedValue(new Error);
        const req = (0, node_mocks_http_1.createRequest)({
            method: "POST",
            url: "/api/budgets/:budgetId/expenses",
            body: { name: "Test Expense", amount: 500 },
            budget: { id: 1 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.create(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: "Hubo un error" });
        expect(expenseMock.save).not.toHaveBeenCalled();
        expect(Expense_1.default.create).toHaveBeenCalledWith(req.body);
    });
});
describe("ExpensesController.getById", () => {
    it("should return expense with ID 1", async () => {
        const req = (0, node_mocks_http_1.createRequest)({
            method: "GET",
            url: "/api/budgets/:budgetId/expenses/:expenseId",
            expense: expense_1.expenses[0]
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.getById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(expense_1.expenses[0]);
    });
});
describe("ExpensesController.updateById", () => {
    it("should return expense Update", async () => {
        const expenseMock = {
            ...expense_1.expenses[0],
            update: jest.fn().mockResolvedValue(true)
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: "PUT",
            url: "/api/budgets/:budgetId/expenses/:expenseId",
            expense: expenseMock,
            body: { name: "Updated Expense", amount: 100 }
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.updateById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual("Se actualizó correctamente");
        expect(expenseMock.update).toHaveBeenCalledWith(req.body);
        expect(expenseMock.update).toHaveBeenCalledTimes(1);
    });
});
describe("ExpensesController.deleteById", () => {
    it("Should delete expense with id", async () => {
        const expenseMock = {
            ...expense_1.expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        };
        const req = (0, node_mocks_http_1.createRequest)({
            method: "DELETE",
            url: "/api/budgets/:budgetId/expenses/:expenseId",
            expense: expenseMock,
        });
        const res = (0, node_mocks_http_1.createResponse)();
        await ExpenseController_1.ExpensesController.deleteById(req, res);
        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual("Gasto Eliminado Correctamente");
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
        expect(expenseMock.destroy).toHaveBeenCalled();
    });
});
//# sourceMappingURL=ExpenseController.test.js.map