import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExists } from "../../../middleware/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expense";
import { hasAccess } from "../../../middleware/budget";
import { budgets } from "../../mocks/budget";

jest.mock("../../../models/Expense", () => ({
    findByPk: jest.fn()
}))


describe("Expenses Middleware - validateExpenseExists", () => {

    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter( ex => ex.id === id)[0] ?? null;
            return Promise.resolve(expense);
        })
    })

    it("Should handle a non-existent budget", async () => {

        const req = createRequest({
            params:{expenseId: 120}
        })

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req,res,next);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({error: "Gasto no encontrado"})
        expect(next).not.toHaveBeenCalled();
    })

    it("Should call net middleware if expense exists", async () => {

        const req = createRequest({
            params:{expenseId: 1}
        })

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req,res,next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.expense).toEqual(expenses[0]);

    })

    it("Should handle internal serve error", async () => {

        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error);

        const req = createRequest({
            params:{expenseId: 1}
        })

        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req,res,next);

        const data = res._getJSONData();

        expect(next).not.toHaveBeenCalled();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({error:'hubo un error'})
    })

    it("Should prevent unauthorized users form adding expenses", async () => {

        const req = createRequest({
            method:"POST",
            url:"/api/budgets/:budgetId/expenses",
            budget: budgets[0],
            user:{id: 20},
            body: {name: "Expense Test", amount:3000}
        })
        const res = createResponse();
        const next = jest.fn();

        hasAccess(req,res,next);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toEqual({error:"Acción no válida"});
        expect(next).not.toHaveBeenCalled();
    })



})