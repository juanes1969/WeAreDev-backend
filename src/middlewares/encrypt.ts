import * as fs from 'fs/promises';
import { JWE, JWK } from 'node-jose';

export async function Encrypt(payload: object): Promise<string> {
	try {
		const publicKeyPem = await fs.readFile('./keys/publickey.pem', 'utf-8');
		const publicKey = await JWK.asKey(publicKeyPem, 'pem');

		const buffer = Buffer.from(JSON.stringify(payload));

		return await JWE.createEncrypt({ format: 'compact' }, publicKey).update(buffer).final();
	} catch (error) {
		console.error(error);

		return '';
	}
}
