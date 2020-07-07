import {Request, Response, NextFunction, RequestHandler} from 'express';


const Logger: RequestHandler  = (req: Request, res: Response, next: NextFunction) => {
    console.log(`request at: ${req.path} | ${req.method}`)
    next();
}

export default Logger