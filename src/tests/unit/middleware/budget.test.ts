import {createRequest, createResponse} from 'node-mocks-http';
import { hasAccess, validateBudgetExists } from '../../../middleware/budget';
import Budget from '../../../models/Budget';
import { budgets } from '../../mocks/budget';

jest.mock("../../../models/Budget", () => ({
    findByPk: jest.fn()
}))

describe("budget - validateBudgetExists", () => {
    it("Should handle non-existent budget", async () => {

        (Budget.findByPk as jest.Mock).mockResolvedValue(null);

        const req = createRequest({
            params: {
                budgetId: 1
            }
        })

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).not.toBe(401);
        expect(data).toEqual({error:"Presupuesto no encontrado"});
        expect(next).not.toHaveBeenCalled();
    })

    it("Should proceed to next middleware if budget exists", async () => {

        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0]);

        const req = createRequest({
            params: {
                budgetId: 1
            }
        })

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req,res,next);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(req.budget).toEqual(budgets[0])
    })

    it("Should go to catch if it have error", async () => {

        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error);

        const req = createRequest({
            params: {
                budgetId: 1
            }
        })

        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req,res,next);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error: "Hubo un error"});
        expect(next).not.toHaveBeenCalled();
    })
})

describe("budget - hasAccess" , () => {
    it("Should return 401 error if userId doesn´t have access to budget", () => {
        const req = createRequest({
            budget: budgets[0],
            user:{id: 2}
        })

        const res = createResponse();
        const next = jest.fn();

        hasAccess(req,res,next);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toEqual({error:"Acción no válida"});
        expect(next).not.toHaveBeenCalled();
    })

    it("Should go to next function if user has the same id", () => {
        const req = createRequest({
            budget:budgets[0],
            user:{id:1}
        })
        const res = createResponse();
        const next = jest.fn();

        hasAccess(req,res,next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    })
})