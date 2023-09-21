import { Request, Response } from 'express';

import { generateToken, comparePassword } from './auth.helper.ts';
import { getUser } from '../../repositories/index.ts';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../../messages.ts';

export default async function loginHandler(req: Request, res: Response) {
	const { email, password } = req.body;

	const user = await getUser(email);

	if (!user) {
		res.status(400).json({
			ok: false,
			message: ERROR_MESSAGE.LOGIN_INVALID_CREDENTIAL,
		});
		return;
	}

	const { password: saltedPassword, profile } = user;

	const isValid = await comparePassword(password, saltedPassword);

	if (!isValid) {
		res.status(400).json({
			ok: false,
			message: ERROR_MESSAGE.LOGIN_INVALID_CREDENTIAL,
		});
		return;
	}

	const jwtSecret = process.env.JWT_SECRET;

	if (!jwtSecret) {
		console.error('JWT secret is missing');
		res.status(500).json({
			ok: false,
			message: ERROR_MESSAGE.SERVER_ERROR,
		});
		return;
	}

	if (!profile) {
		console.error('profile is expected but does not exist');
		res.status(500).json({
			ok: false,
			message: ERROR_MESSAGE.SERVER_ERROR,
		});
		return;
	}

	const { profileId } = profile;

	res.status(200).json({
		ok: true,
		message: SUCCESS_MESSAGE.LOGIN_SUCCESS,
		token: generateToken(email, profileId, jwtSecret),
	});
}
