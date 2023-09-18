import { Request, Response } from 'express';

import { hashPassword } from './auth.helper.ts';
import { DatabaseClient } from '../../infra/index.ts';

interface CreateUserWithProfileProps {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

async function createUserWithProfile({
	email,
	password,
	firstName,
	lastName,
}: CreateUserWithProfileProps) {
	await DatabaseClient.user.create({
		data: {
			email,
			password,
			profile: {
				create: {
					firstName,
					lastName,
				},
			},
		},
	});
}

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
			message: 'user created successfully',
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
			message: 'something unexpected happened on the server',
		});
	}
}
