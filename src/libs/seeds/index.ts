import { Models } from '../db';
import { BULK } from './data';

export default async function CreateDBSeeds() {
	const [AdminUser, LeaderUser, CollaboratorUser] = await Models.Users().bulkCreate(BULK.USERS);
	const [AdminRole, LeaderRole, CollaboratorRole] = await Models.Roles().bulkCreate(BULK.ROLES);
	await Models.Client().bulkCreate(BULK.CLIENTS)
	await Models.Proyect().bulkCreate(BULK.PROJECTS)
	await Models.State().bulkCreate(BULK.STATES)
	await Models.Templates().bulkCreate(BULK.TEMPLATES)

	AdminUser.addRoles(AdminRole);
	LeaderUser.addRoles(LeaderRole);
	CollaboratorUser.addRoles(CollaboratorRole);
}
