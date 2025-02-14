import type { Request, Response } from 'express'
import Expense from '../models/Expense';

export class ExpensesController {
  
    static create = async (req: Request, res: Response) => {
        try {
            const budgetId = req.budget.id;
            const expense = await Expense.create(req.body);
            expense.budgetId = budgetId;
            await expense.save();

            res.status(201).json("Gasto Agregado Correctamente");
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
        }
    }
  
    static getById = async (req: Request, res: Response) => {
        res.json(req.expense);
    }

    static updateById = async (req: Request, res: Response) => {
        await req.expense.update(req.body);
        res.json("Se actualizó correctamente");
    }
  
    static deleteById = async (req: Request, res: Response) => {
        await req.expense.destroy();
        res.json("Gasto Eliminado Correctamente");

    }
}