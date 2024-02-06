const W_FOUND = 'found';
const W_SUCCESS = 'success';

export const ResponseMessages = {
	// Auth
	Login: {
		success: `Login ${W_SUCCESS}`,
		failed: '',
	},

	// Users
	UserFound: {
		success: `User ${W_FOUND}`,
		failed: '',
	},
	UsersFound: {
		success: `Users ${W_FOUND}`,
		failed: '',
	},
	UserCreated: {
		success: 'User created successfully',
		failed: 'User not created',
	},
	UserModified: {
		success: 'User modified successfully',
		failed: 'User not modified',
	},

	//registerTimes
	RegisterTimeCreated: {
		success: `Register time created ${W_SUCCESS}`,
		failed: 'Register Time not created'
	},

	RegisterTimeList: {
		success: `Register time Listed ${W_SUCCESS}`,
		failed: `Register Time Listed ${W_FOUND}`
	},

	//Roles
	RolesFound: {
		success: `Role Found Success`,
		failed: 'Role not created'
	},

	//Client
	ClientFound: {
		success: `Client created`,
		failed: 'Client not created'
	},

	//Project
	ProjectFound: {
		success: `Project created`,
		failed: 'Project not created'
	},

	// Not controller
	NotController: {
		success: 'Controller not implemented',
		failed: '',
	},
};
