import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import { db } from './config/db'
import budgetRouter from "./routers/budgetRouter"
import authRouter from "./routers/authRouter"
import { limiter } from './config/limiter'

export async function connectDB() {
    try {
        await db.authenticate(); //Crea la autenticacion y poder hacer operaciones
        db.sync(); // al momento de usar async se crea tablas y cambios que hagamos a las tablas
        console.log(colors.blue.bold("Conexión existosa a la BD"));
    } catch (error) {
        //console.log(error);

        console.log(colors.red.bold("Falló la conexión a la BD"));
    }
}

connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())


app.use("/api/budgets", budgetRouter)
app.use("/api/auth", authRouter)


export default app