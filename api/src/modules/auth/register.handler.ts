import { Request, Response } from 'express';

import { hashPassword } from './auth.helper.ts';
import { createUserWithProfile } from '../../repositories/index.ts';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../../messages.ts';

export default async function registerHandler(req: Request, res: Response) {
	console.debug('inside register user handler');

	const { email, password, firstName, lastName } = req.body;
	const SALT_ROUNDS = 10;

	const hashedPassword = await hashPassword(password, SALT_ROUNDS);

	try {
		console.debug('creating user:', { email, firstName, lastName });

		await createUserWithProfile({
			email,
			firstName,
			lastName,
			password: hashedPassword,
		});

		res.status(200);
		res.json({
			ok: true,
			message: SUCCESS_MESSAGE.USER_CREATE_SUCCESS,
		});
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		} else {
			console.error('unexpected error:', error);
		}

		res.status(500);
		res.json({
			ok: false,
			message: ERROR_MESSAGE.SERVER_ERROR,
		});
	}
}
