import type { Request, Response, NextFunction } from "express";
import Budget from "../models/Budget";
declare global {
    namespace Express {
        interface Request {
            budget?: Budget;
        }
    }
}
export declare const validateBudgetId: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateBudgetExists: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const validateBudgetInput: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function hasAccess(req: Request, res: Response, next: NextFunction): void;
