import {Request,Response,NextFunction} from 'express';

interface AuthenticatedRequest extends Request{
    user?:{
        id:number;
        role:string;
    };
}

export const checkRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if(!req.user){
            return res.status(401).json({error: "Authentication required"});
        }

        if (!allowedRoles.includes(req.user.role)){
            return res.status(403).json({error: "Insufficient permissions"});
        }

        next();
    };
};

