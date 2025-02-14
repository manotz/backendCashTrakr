"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBudgetInput = exports.validateBudgetExists = exports.validateBudgetId = void 0;
exports.hasAccess = hasAccess;
const express_validator_1 = require("express-validator");
const Budget_1 = __importDefault(require("../models/Budget"));
const validateBudgetId = async (req, res, next) => {
    await (0, express_validator_1.param)("budgetId").notEmpty().withMessage("El valor de id es obligatorio").bail()
        .isInt().withMessage("id no válido").bail()
        .custom(value => value > 0).withMessage("id no válido").run(req); //Agregar run(req) y async await cuando la validacion no esta en el router
    let errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validateBudgetId = validateBudgetId;
const validateBudgetExists = async (req, res, next) => {
    try {
        const { budgetId } = req.params;
        const budget = await Budget_1.default.findByPk(budgetId);
        if (!budget) {
            const error = new Error("Presupuesto no encontrado");
            res.status(404).json({ error: error.message });
            return;
        }
        req.budget = budget;
        next();
    }
    catch (error) {
        res.status(500).json({ error: "Hubo un error" });
    }
};
exports.validateBudgetExists = validateBudgetExists;
const validateBudgetInput = async (req, res, next) => {
    await (0, express_validator_1.body)("name").notEmpty().withMessage("El nombre no puede estar vacio").run(req);
    await (0, express_validator_1.body)("amount").notEmpty().withMessage("La cantidad del presupuesto no puede ir vacia").isNumeric().withMessage("Cantidad no válida").custom(value => value > 0).withMessage("El presupuesto debe ser mayor a cero").run(req);
    next();
};
exports.validateBudgetInput = validateBudgetInput;
function hasAccess(req, res, next) {
    if (req.budget.userId !== req.user.id) {
        const error = new Error("Acción no válida");
        res.status(401).json({ error: error.message });
        return;
    }
    next();
}
//# sourceMappingURL=budget.js.map