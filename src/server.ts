import express, { Application } from 'express';

import Init from './helper/IbaseInit.interface';

class App {
	public app: Application;
	public port: number;
	public io ?: any[];
	private arr: any[];
	
	constructor(init: Init) {
		this.app = express();
		this.port = init.port;
		this.middlewares(init.middlewares);
		this.routes(init.controllers);
	}

	private middlewares(middleWares: {
		forEach: (arg0: (middleWare: any) => void) => void;
	}) {
		middleWares.forEach((middleWare) => {
			this.app.use(middleWare);
		});
	}
	private routes(controllers: {
		forEach: (arg0: (controller: any) => void) => void;
	}) {
		controllers.forEach((controller) => {
			this.app.use('/', controller.router);
		});
	}

	public set(arr: any[]) {
		this.arr = arr;
	}
	public get(): any[] {
		return this.arr;
	}

	public listen() {
		this.app.listen(this.port, (): void => {
			console.log('server running on http://localhost:' + this.port);
		});
	}
}


export default App;