import { Model } from "sequelize-typescript";
import Budget from "./Budget";
declare class Expense extends Model {
    name: string;
    amount: number;
    budgetId: number;
    budget: Budget;
}
export default Expense;
