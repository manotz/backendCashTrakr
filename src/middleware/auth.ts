import type { Request, Response, NextFunction } from "express";
import { decoded } from "../utils/jwt";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }   
    }
}

export const authenticate = async (req : Request, res : Response, next: NextFunction) => {
            const bearer = req.headers.authorization;

            if(!bearer){
                const error = new Error("No Autorizado");
                res.status(401).json({error:error.message});
                return
            }

            const [ , token] = bearer.split(" ");

            if(!token) {
                const error = new Error("token no válido");
                res.status(401).json({error:error.message});
                return
            }
            
            try {

                const respuesta = decoded(token);
                
                if(typeof respuesta === "object" && respuesta.id){

                    
                    const user = await User.findByPk(respuesta.id, {
                        attributes:['id', 'name', 'email']
                    });

                    req.user = user;
                    next();

                }
                 
            } catch (error) {
                res.status(500).json({error: "Token no válido"})
            }

}