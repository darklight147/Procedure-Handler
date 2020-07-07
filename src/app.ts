import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import logger from 'morgan';
import session from 'express-session';
import connectMongoo, { MongoStoreFactory } from 'connect-mongo';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import AddGame from "./controllers/add-game.controller"
import Logger from './middleware/logger.middleware'

import originIsAllowed from "./controllers/origin.controller"
// socket server

const MongoStore: MongoStoreFactory = connectMongoo(session);

import App from './server';
import { server as WebSocketServer } from 'websocket';
import http from 'http';

const server = http.createServer((request: Request, response: Response) => {
	console.log(new Date() + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});

server.listen(1212, () => {
	console.log(new Date() + ' Server is listening on port 1212');
});

const wsServer: WebSocketServer = new WebSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

dotenv.config({ path: '.env' });

mongoose
.connect(process.env.MONGODB_URI, {
	useNewUrlParser: !0,
	useUnifiedTopology: !0,
	useCreateIndex: true,
})
.then(() => console.log('connected to database!'));
const app: App = new App({
	middlewares: [
		compression(),
		logger('dev'),
		Logger,
		bodyParser.json(),
		bodyParser.urlencoded({ extended: true }),
		session({
			resave: true,
			saveUninitialized: true,
			secret: process.env.SESSION_SECRET,
			cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
			store: new MongoStore({
				url: process.env.MONGODB_URI,
				autoReconnect: true,
			}),
		})
	],
	port: 4142,
	controllers: [
		new AddGame()
	]
});

const clients: any[] = [];
wsServer.on('request', (request) => {
	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log(
			new Date() + ' Connection from origin ' + request.origin + ' rejected.'
		);
		return;
	}

	const connection = request.accept('echo-protocol', request.origin);
	console.log(new Date() + ' Connection accepted.');
	clients.push(connection);
	// app.io = clients;
	app.set(clients);
	const EmitMessage = (req: Request, res: Response, next: NextFunction) => {
		console.log('got here');
		connection.sendUTF('adding');
		next();
	};
	connection.on('close', (reasonCode, description) => {
		console.log(
			new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
		);
	});
});





app.listen();

export default app;