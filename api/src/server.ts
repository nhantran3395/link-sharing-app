import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { registerHandler, tokenMiddleware, loginHandler } from './modules/auth';

export function createServer() {
	const server = express();

	server.use(cors());
	server.use(morgan('short'));
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));

	server.get('/ping', (_req, res) => {
		res.json({
			message: 'pong',
		});
	});

	server.post('/login', loginHandler);

	server.post('/register', registerHandler);

	server.get('/profiles/:id', tokenMiddleware, (_req, res) => {
		res.status(200).json({
			ok: true,
		});
	});

	return server;
}
