import jwt from "jsonwebtoken";


export const generateJWT = (id:string) : string => {
    
    const token = jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:'15d'
    })

    return token
}

export const decoded = (token: string) => {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    return decode;
}