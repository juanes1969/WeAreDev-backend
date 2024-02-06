import SendGridMsl from '@sendgrid/mail';
import { Models } from '../../../libs';
import { Config } from '../../../utils';


async function sendMail({
	payload,
}: {
	payload: {
		description: string,
		userSendId: number,
		userReceiveEmail: string,
		icon: string,
		colorIcon: string,
		colorCard: string,
		templateId: number
	};
}) {

	SendGridMsl.setApiKey(Config().SENDGRID_SECRET_APIKEY);

	const KUDOS_REGISTER = await Models.KudosRegister().create({
		description: payload.description,
		userSendId: payload.userSendId,
		userReceiveEmail: payload.userReceiveEmail,
		icon: payload.icon,
		colorIcon: payload.colorIcon,
		colorCard: payload.colorCard,
		templateId: payload.templateId
	});

	const messageMail = {
		to: 'juan.olaya@wearedev.co',
		from: payload.userReceiveEmail,
		subject: '¡Te han enviado un kudo, Felicitaciones!',
		text: payload.description,
	};


	try {
		await SendGridMsl.send(messageMail);

	} catch (error) {
		console.error('Error al enviar el correo electrónico:', error);
	}

	return { KUDOS_REGISTER };
}

async function getKudosByEmail(email: string) {


	const { count, rows } = await Models.KudosRegister().findAndCountAll({
		where: {
			userReceiveEmail: email
		}
	})

	if (count === 0) {
		throw {
			message: 'kudoByEmailNotFound',
		};
	}

	return rows
}


export default {
	sendMail,
	getKudosByEmail
};
