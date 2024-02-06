import * as fs from 'fs/promises';
import { JWE, JWK } from 'node-jose';

export async function Decrypt(token: string): Promise<object | undefined> {
	try {
		const privateKeyPem = await fs.readFile('./keys/privatekey.pem', 'utf-8');
		const privateKey = await JWK.asKey(privateKeyPem, 'pem');

		const decrypted = await JWE.createDecrypt(privateKey).decrypt(token);

		return JSON.parse(decrypted.plaintext.toString());
	} catch (error) {
		console.error(error);
	}
}
