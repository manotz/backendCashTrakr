"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.belongsToBudget = exports.validateExpenseExists = exports.validateExpenseId = exports.validateExpenseInput = void 0;
const express_validator_1 = require("express-validator");
const Expense_1 = __importDefault(require("../models/Expense"));
const validateExpenseInput = async (req, res, next) => {
    await (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre del gasto no puede estar vacio").run(req);
    await (0, express_validator_1.body)("amount").notEmpty().withMessage("La cantidad del del gasto no puede ir vacia").isNumeric().withMessage("Cantidad no válida").custom(value => value > 0).withMessage("El gasto debe ser mayor a cero").run(req);
    next();
};
exports.validateExpenseInput = validateExpenseInput;
const validateExpenseId = async (req, res, next) => {
    await (0, express_validator_1.param)("expenseId").isInt().withMessage("Id de gasto no válido").custom(value => value > 0).withMessage("Id gasto no válido").run(req);
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateExpenseId = validateExpenseId;
const validateExpenseExists = async (req, res, next) => {
    try {
        const { expenseId } = req.params;
        const expense = await Expense_1.default.findByPk(expenseId);
        if (!expense) {
            const error = new Error("Gasto no encontrado");
            res.status(404).json({ error: error.message });
            return;
        }
        req.expense = expense;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'hubo un error' });
    }
};
exports.validateExpenseExists = validateExpenseExists;
const belongsToBudget = async (req, res, next) => {
    if (req.budget.id !== req.expense.budgetId) {
        const error = new Error("Acción no válida");
        return res.status(403).json({ error: error.message });
    }
    next();
};
exports.belongsToBudget = belongsToBudget;
//# sourceMappingURL=expense.js.map