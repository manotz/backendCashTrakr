import type { Request, Response, NextFunction } from "express"
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";


//INFO: Sirve para agregar la propiedad a typescript y no de error, en este caso se agrega budget para mandar budget a traves del req.
declare global {
    namespace Express {
        interface Request {
            budget?: Budget //Hacerlo opcional para que no de error y solo en algunos casos enviarlo
        }
    }
}

export const validateBudgetId = async (req: Request, res:Response, next: NextFunction) => {

        await param("budgetId").notEmpty().withMessage("El valor de id es obligatorio").bail()
        .isInt().withMessage("id no válido").bail()
        .custom(value => value > 0).withMessage("id no válido").run(req)      //Agregar run(req) y async await cuando la validacion no esta en el router

        let errors = validationResult(req)
        if (!errors.isEmpty()) {   
            res.status(400).json({ errors: errors.array() })
            return
        }
         next()
}


export const validateBudgetExists = async (req: Request, res:Response, next: NextFunction) => {

    try {
        const {budgetId} = req.params;

        const budget = await Budget.findByPk(budgetId);

        if(!budget){
            const error = new Error("Presupuesto no encontrado");
            res.status(404).json({error:error.message});
            return
        }

        req.budget = budget;

        next();
    } catch (error) {
        res.status(500).json({error: "Hubo un error"});
    }

}

export const validateBudgetInput = async (req: Request, res:Response, next: NextFunction) => {

    await body("name").notEmpty().withMessage("El nombre no puede estar vacio").run(req)
    await body("amount").notEmpty().withMessage("La cantidad del presupuesto no puede ir vacia").isNumeric().withMessage("Cantidad no válida").custom(value => value > 0).withMessage("El presupuesto debe ser mayor a cero").run(req)

     next()
}


export function hasAccess(req: Request, res:Response, next: NextFunction) {

    if(req.budget.userId !== req.user.id) {
        const error = new Error("Acción no válida");
        res.status(401).json({error:error.message});
        return
    }

    next();
}