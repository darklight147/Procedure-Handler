import { Application } from 'express';

interface IApp extends Application {
	io?: any[];
}

export default IApp;