import { ModelsAssociations } from './models';

export function setDBAssociations() {
	ModelsAssociations.forEach((setModelAssociation) => {
		setModelAssociation();
	});
}
