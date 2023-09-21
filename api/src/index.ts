import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { CONFIGS } from './configs.ts';

import {
	registerHandler,
	tokenMiddleware,
	loginHandler,
} from './modules/auth/index.ts';

const app = express();
const port = CONFIGS.PORT;

app.use(cors());
app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', (_req, res) => {
	res.json({
		message: 'pong',
	});
});

app.post('/login', loginHandler);

app.post('/register', registerHandler);

app.get('/profiles/:id', tokenMiddleware, (_req, res) => {
	res.status(200).json({
		ok: true,
	});
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
