/* eslint-disable @typescript-eslint/no-explicit-any */
import { Repos } from '../../../repos';

async function Signup() {
	return;
}
interface TAuthLogin {
	payload: {
		email: string;
	};
}

async function Login({ payload }: TAuthLogin) {
	return await Repos.getUser({ payload: { email: payload.email }, showPassword: true });
}

// async function Login({ payload }: TAuthLogin) {
// 	return await Repos.getUser({ payload: { email: payload.email }, showPassword: true });
// }


export default {
	Signup,
	Login,
};
