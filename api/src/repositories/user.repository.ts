import { DatabaseClient } from '../infra/index';

export async function getUser(email: string) {
	return await DatabaseClient.user.findUnique({
		where: {
			email,
		},
		include: {
			profile: true,
		},
	});
}

interface CreateUserWithProfileProps {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}

export async function createUserWithProfile({
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
