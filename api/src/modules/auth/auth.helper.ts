import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export function checkToken(token: string, secret: string) {
	try {
		return jwt.verify(token, secret);
	} catch (error) {
		throw error;
	}
}

export function generateToken(
	email: string,
	profileId: string,
	secret: string
): string {
	return jwt.sign(
		{
			email,
			profileId,
		},
		secret
	);
}

export async function comparePassword(
	input: string,
	hashed: string
): Promise<boolean> {
	return await bcrypt.compare(input, hashed);
}

export function hashPassword(input: string, salt: number): Promise<string> {
	return bcrypt.hash(input, salt);
}
