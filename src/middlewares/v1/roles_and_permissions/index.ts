/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

export function checkRolesAndPermissions(roles: Array<string>, permissions: Array<string>) {
	return (req: Request, res: Response, next: NextFunction) => {
		// const user: TUserModel = req.body.user;
		const user: any = req.body.user;

		const hasRequiredRole = roles.some((role) => user.roles.includes(role));

		if (!hasRequiredRole) {
			return res.status(403).json({ error: 'You do not have permission to perform this action.' });
		}

		for (const role of roles) {
			const requiredPermissions = permissions;

			if (requiredPermissions) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const missingPermissions = requiredPermissions.filter((p) => !user.permissions.includes(p));

				if (missingPermissions.length > 0) {
					return res.status(403).json({
						error: `You are missing the following permissions for role '${role}': ${missingPermissions.join(', ')}`,
					});
				}
			}
		}

		next();
	};
}
