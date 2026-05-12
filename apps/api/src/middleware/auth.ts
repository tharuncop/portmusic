import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {sub: string};
        req.userId = decoded.sub;
        next();
        
    } catch{
        return res.status(401).json({error: 'Invalid token'});
    }
}