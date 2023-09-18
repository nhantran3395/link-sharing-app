import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import process from 'node:process';

import { checkToken } from './auth.helper.ts';

declare module 'express-serve-static-core' {
	interface Request {
		user: jwt.JwtPayload | undefined;
	}
}

export default function tokenMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const bearer = req.headers.authorization;

	if (!bearer) {
		res.status(401).json({
			ok: false,
			message: 'must have a bearer token',
		});
		return;
	}

	const [, token] = bearer.split('Bearer ');
	if (!token) {
		res.status(401).json({
			ok: false,
			message: 'invalid bearer token format',
		});
		return;
	}

	const secret = process.env.JWT_SECRET;

	if (!secret) {
		console.error('JWT secret is missing');
		res.status(500).json({
			ok: false,
			message: 'something unexpected happened on the server',
		});
		return;
	}

	let payload: string | jwt.JwtPayload = {};

	try {
		payload = checkToken(token, secret);
	} catch (error) {
		res.status(401).json({
			ok: false,
			message: 'token is invalid',
		});
	}

	if (typeof payload === 'string') {
		res.status(400).json({
			ok: false,
			message: 'type of JWT payload is invalid',
		});
		return;
	}

	req.user = payload;
	next();
}
