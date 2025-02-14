import type { Request, Response, NextFunction } from "express";
import Expense from "../models/Expense";
declare global {
    namespace Express {
        interface Request {
            expense?: Expense;
        }
    }
}
export declare const validateExpenseInput: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateExpenseId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateExpenseExists: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const belongsToBudget: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
