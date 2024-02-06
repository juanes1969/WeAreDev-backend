/* eslint-disable @typescript-eslint/no-explicit-any */
import JSONWebToken from 'jsonwebtoken';
import { Config } from './config';

type Sign = {
	bearer: string;
	expiration: string;
};

/**
 *
 * @param object object
 * @returns string
 */

function Sign(data?: Record<any, any>, expiresIn?: string | number | undefined): Sign | undefined {
	const DATA = data?.dataValues ? data.dataValues : data;

	try {
		return {
			bearer: JSONWebToken.sign(DATA ?? {}, Config().JWT_SECRET_KEY as string, {
				expiresIn: expiresIn ?? Config().JWT_EXPIRES_IN,
			}),
			expiration: Config().JWT_EXPIRES_IN,
		};
	} catch (error) {
		return {
			bearer: '',
			expiration: Config().JWT_EXPIRES_IN,
		};
	}
}

/**
 * Decode JWT token
 * @param token string
 * @returns string or null
 */

function Decode(token: string | undefined): string | Record<any, any> | null {
	if (!token) return null;

	const DECODED = JSONWebToken.decode(token);

	return typeof DECODED === 'object' ? DECODED : typeof DECODED === 'string' ? DECODED : null;
}

function Verify({ token }: { token: string | undefined }): boolean | undefined {
	try {
		let result: boolean | undefined;

		const TOKEN = token ? (token.startsWith('Bearer ') ? token.split(' ')[1] : token.trim()) : '';

		JSONWebToken.verify(typeof TOKEN === 'string' ? TOKEN : '', Config().JWT_SECRET_KEY as string, (error) => {
			if (error) {
				result = false;
			} else {
				result = true;
			}
		});

		return result;
	} catch (error) {
		console.error(error);
		return undefined;
	}
}

export const JWT = { Decode, Sign, Verify };
