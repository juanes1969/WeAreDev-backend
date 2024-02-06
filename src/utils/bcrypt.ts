import bcrypt from 'bcrypt';

function hashPassword({ password }: { password: string }): string {
	// Función para generar un hash de contraseña a partir de una contraseña en texto plano.

	const saltRounds = 10; // Número de rondas de sal que se utilizarán para la generación de hash.

	const salt = bcrypt.genSaltSync(saltRounds);

	return bcrypt.hashSync(password, salt);
}

function comparePassword({ password, hash }: { password: string; hash: string | number }): boolean {
	// Función para verificar si una contraseña en texto plano coincide con un hash de contraseña almacenado.

	if (!hash) return false;
	if (typeof hash !== 'string') return false;

	return bcrypt.compareSync(password, hash);
}

export const Bcrypt = { hashPassword, comparePassword };
