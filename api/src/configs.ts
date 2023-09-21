import process from 'node:process';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	throw new Error('JWT secret is missing');
}

export const CONFIGS = {
	ENVIRONMENT: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
	JWT_SECRET: JWT_SECRET,
};
