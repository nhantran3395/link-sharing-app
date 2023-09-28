import { Express } from 'express';
import supertest from 'supertest';

import * as crypto from 'node:crypto';

import { createServer } from './server.ts';
import { createUserWithProfile, getUser } from './repositories/index.ts';

jest.mock('./repositories/index.ts', () => {
	return {
		createUserWithProfile: jest.fn(),
		getUser: jest.fn(),
	};
});

function mockFunction<T extends (...args: any[]) => any>(
	fn: T
): jest.MockedFunction<T> {
	return fn as jest.MockedFunction<T>;
}

describe('POST /register', () => {
	let app: Express | undefined;

	beforeEach(() => {
		app = createServer();
	});

	it('request is rejected when email already exists', async () => {
		const mockFn = mockFunction(createUserWithProfile);

		mockFn.mockImplementation(() => {
			const error = new Error();
			error.name = 'PrismaClientKnownRequestError';
			(error as any).code = 'P2002';
			throw error;
		});

		const res = await supertest(app).post('/register').send({
			email: 'rayhayes@gmail.com',
			password: 'linda2',
			firstName: 'Ray',
			lastName: 'Hayes',
		});

		expect(createUserWithProfile).toBeCalledTimes(1);
		expect(res.status).toBe(400);
		expect(res.body).toEqual({
			ok: false,
			message: 'a user with this email already exists',
		});
	});

	it('request is success when input is valid', async () => {
		const mockFn = mockFunction(createUserWithProfile);

		mockFn.mockImplementation(() => {
			return Promise.resolve();
		});

		const res = await supertest(app).post('/register').send({
			email: 'rayhayes@gmail.com',
			password: 'linda2',
			firstName: 'Ray',
			lastName: 'Hayes',
		});

		expect(createUserWithProfile).toBeCalledTimes(1);
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			ok: true,
			message: 'user created successfully',
		});
	});
});

describe('POST /login', () => {
	let app: Express | undefined;

	beforeEach(() => {
		app = createServer();
	});

	it('request is rejected when input email does not exists', async () => {
		const mockFn = mockFunction(getUser);
		mockFn.mockImplementation(() => Promise.resolve(null));

		const res = await supertest(app).post('/login').send({
			email: 'rayhayes@gmail.com',
			password: 'linda2',
		});

		expect(getUser).toBeCalledTimes(1);
		expect(res.status).toBe(400);
		expect(res.body).toEqual({
			ok: false,
			message: 'email or password is invalid',
		});
	});

	it('request is rejected when password does not exists', async () => {
		const mockFn = mockFunction(getUser);
		mockFn.mockImplementation(() =>
			Promise.resolve({
				email: 'rayhayes@gmail.com',
				password: 'linda2',
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: crypto.randomUUID(),
				profile: null,
			})
		);

		const res = await supertest(app).post('/login').send({
			email: 'rayhayes@gmail.com',
			password: 'linda2',
		});

		expect(getUser).toBeCalledTimes(1);
		expect(res.status).toBe(400);
		expect(res.body).toEqual({
			ok: false,
			message: 'email or password is invalid',
		});
	});

	it('request is success when input is valid', async () => {
		const mockFn = mockFunction(getUser);
		mockFn.mockImplementation(() =>
			Promise.resolve({
				email: 'rayhayes@gmail.com',
				password:
					'$2b$10$aKT34a70ZG05shFLJUGQHeEG/eaDoQOPzZWeTih60Pcq3kTgcWT.K',
				createdAt: new Date(),
				updatedAt: new Date(),
				userId: crypto.randomUUID(),
				profile: {
					profileId: crypto.randomUUID(),
					imageUrl: null,
					firstName: 'Ray',
					lastName: 'Hayes',
					createdAt: new Date(),
					updatedAt: new Date(),
					userId: crypto.randomUUID(),
				},
			})
		);

		const res = await supertest(app).post('/login').send({
			email: 'rayhayes@gmail.com',
			password: 'linda2',
		});

		expect(getUser).toBeCalledTimes(1);
		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			ok: true,
			message: 'login success',
			token: expect.any(String),
		});
	});
});
