import jwt from "jsonwebtoken";
export declare const generateJWT: (id: string) => string;
export declare const decoded: (token: string) => string | jwt.JwtPayload;
