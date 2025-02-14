"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BudgetController_1 = require("../controllers/BudgetController");
const validation_1 = require("../middleware/validation");
const budget_1 = require("../middleware/budget");
const ExpenseController_1 = require("../controllers/ExpenseController");
const expense_1 = require("../middleware/expense");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate); //req.user
router.param("budgetId", budget_1.validateBudgetId);
router.param("budgetId", budget_1.validateBudgetExists); //req.budget
router.param("budgetId", budget_1.hasAccess);
router.param("expenseId", expense_1.validateExpenseId);
router.param("expenseId", expense_1.validateExpenseExists); //req.expense
router.param("expenseId", expense_1.belongsToBudget); //req.expense
router.get("/", BudgetController_1.BudgetController.getAll);
router.post("/", budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.create);
router.get("/:budgetId", BudgetController_1.BudgetController.getById);
router.put("/:budgetId", budget_1.validateBudgetInput, validation_1.handleInputErrors, BudgetController_1.BudgetController.updateById);
router.delete("/:budgetId", BudgetController_1.BudgetController.deleteById);
/**Routes for Expenses */
router.post("/:budgetId/expenses", expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpenseController_1.ExpensesController.create);
router.get("/:budgetId/expenses/:expenseId", ExpenseController_1.ExpensesController.getById);
router.put("/:budgetId/expenses/:expenseId", expense_1.validateExpenseInput, validation_1.handleInputErrors, ExpenseController_1.ExpensesController.updateById);
router.delete("/:budgetId/expenses/:expenseId", ExpenseController_1.ExpensesController.deleteById);
exports.default = router;
//# sourceMappingURL=budgetRouter.js.map