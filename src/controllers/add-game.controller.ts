import { Request, Response, Router, NextFunction } from 'express';

import IControllerBase from '../helper/initRoutes.interface';
import app from "../app"
import addGame from '../controllers/secret';
import Logger from '../middleware/logger.middleware';




class GameAdder implements IControllerBase {
	public path = '/add-game';
	public router = Router();

	constructor() {
		this.initRoutes();
	}

	public initRoutes() {
        this.router.use(Logger)
		this.router.use('/add-game', this.emitC, addGame);
    }
    // emitter
    emitC = (req: Request, res: Response, next: NextFunction) => {
        if (app.get()) {
            app.get().forEach((element: any) => {
                element.sendUTF('adding');
            });
            console.log('message sent', app.get().length);
        } else {
            console.log('no connected users');
        }
        next();
    };
}

export default GameAdder;
