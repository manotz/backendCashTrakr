import { Model } from "sequelize-typescript";
import Budget from "./Budget";
declare class User extends Model {
    name: string;
    password: string;
    email: string;
    token: string;
    confirmed: boolean;
    budgets: Budget[];
}
export default User;
