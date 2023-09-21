import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import process from 'node:process';

import { checkToken } from './auth.helper.ts';
import { ERROR_MESSAGE } from '../../messages.ts';

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
			message: ERROR_MESSAGE.AUTH_BEARER_TOKEN_NOT_EXIST,
		});
		return;
	}

	const [, token] = bearer.split('Bearer ');
	if (!token) {
		res.status(401).json({
			ok: false,
			message: ERROR_MESSAGE.AUTH_TOKEN_INVALID_FORMAT,
		});
		return;
	}

	const secret = process.env.JWT_SECRET;

	if (!secret) {
		console.error('JWT secret is missing');
		res.status(500).json({
			ok: false,
			message: ERROR_MESSAGE.SERVER_ERROR,
		});
		return;
	}

	let payload: string | jwt.JwtPayload = {};

	try {
		payload = checkToken(token, secret);
	} catch (error) {
		res.status(401).json({
			ok: false,
			message: ERROR_MESSAGE.AUTH_TOKEN_INVALID,
		});
	}

	if (typeof payload === 'string') {
		res.status(400).json({
			ok: false,
			message: ERROR_MESSAGE.AUTH_INVALID_TOKEN_PAYLOAD,
		});
		return;
	}

	req.user = payload;
	next();
}
