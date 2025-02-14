"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesController = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
class ExpensesController {
    static create = async (req, res) => {
        try {
            const budgetId = req.budget.id;
            const expense = await Expense_1.default.create(req.body);
            expense.budgetId = budgetId;
            await expense.save();
            res.status(201).json("Gasto Agregado Correctamente");
        }
        catch (error) {
            res.status(500).json({ error: "Hubo un error" });
        }
    };
    static getById = async (req, res) => {
        res.json(req.expense);
    };
    static updateById = async (req, res) => {
        await req.expense.update(req.body);
        res.json("Se actualizó correctamente");
    };
    static deleteById = async (req, res) => {
        await req.expense.destroy();
        res.json("Gasto Eliminado Correctamente");
    };
}
exports.ExpensesController = ExpensesController;
//# sourceMappingURL=ExpenseController.js.map