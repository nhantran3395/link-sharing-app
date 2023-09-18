import { Request, Response } from 'express';

import { generateToken, comparePassword } from './auth.helper.ts';
import { DatabaseClient } from '../../infra/index.ts';

async function getUser(email: string) {
	return await DatabaseClient.user.findUnique({
		where: {
			email,
		},
		include: {
			profile: true,
		},
	});
}

export default async function loginHandler(req: Request, res: Response) {
	const { email, password } = req.body;

	const user = await getUser(email);

	if (!user) {
		res.status(400).json({
			ok: false,
			message: 'email or password is not valid',
		});
		return;
	}

	const { password: saltedPassword, profile } = user;

	const isValid = await comparePassword(password, saltedPassword);

	if (!isValid) {
		res.status(400).json({
			ok: false,
			message: 'email or password is not valid',
		});
		return;
	}

	const jwtSecret = process.env.JWT_SECRET;

	if (!jwtSecret) {
		console.error('JWT secret is missing');
		res.status(500).json({
			ok: false,
			message: 'something unexpected happened on the server',
		});
		return;
	}

	if (!profile) {
		console.error('profile is expected but does not exist');
		res.status(500).json({
			ok: false,
			message: 'something unexpected happened on the server',
		});
		return;
	}

	const { profileId } = profile;

	res.status(200).json({
		ok: true,
		message: 'login success',
		token: generateToken(email, profileId, jwtSecret),
	});
}
