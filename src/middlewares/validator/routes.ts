export const ROUTES = [
	{
		url: 'POST-/v1/user/list',
		roles: ['admin'],
		permissions: [],
	},
	{
		url: 'POST-/v1/user/',
		roles: ['admin'],
		permissions: [],
		params: {
			model: '',
		},
	},
	{
		url: 'PATCH-/v1/user/',
		roles: ['admin'],
		permissions: {
			admin: ['read', 'write', 'delete'],
		},
	},
	{
		url: 'POST-/v1/auth/login',
		roles: ['public'],
		permissions: [],
	},
	{
		url: 'POST-/v1/auth/forgot-password',
		roles: ['public'],
		permissions: [],
	},
	{
		url: 'POST-/v1/auth/verify-password',
		roles: ['public'],
		permissions: [],
	},
	{
		url: 'PATCH-/v1/auth/reset-password',
		roles: ['public'],
		permissions: [],
	},
];
