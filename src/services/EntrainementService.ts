import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

import EntrainementRepo from '@src/repos/EntrainementRepo';
import UtilisateurRepo from '@src/repos/UtilisateurRepo';
import { IEntrainement } from '@src/models/Entrainement';
import { CategoriesTypes } from '@src/models/Entrainement';
import { Types } from 'mongoose';

export const ENTRAINEMENT_NOT_FOUND_ERR = 'Entraînement non trouvé';
export const USER_NOT_FOUND_ERR = 'Utilisateur non trouvé';

/**
 * Recherche un entraînement par son id
 */
async function getOne(id: Types.ObjectId): Promise<IEntrainement | undefined> {
  const entrainement = await EntrainementRepo.getOne(id);
  if (!entrainement) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Entraînement non trouvé');
  }

  if (!entrainement.publique) {
    throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Entraînement non trouvé');
  }

  return entrainement;
}

/**
 * Recherche tous les entraînements publics
 */
async function getAll(): Promise<IEntrainement[]> {
  const entrainements = await EntrainementRepo.getAll();

  if (entrainements.length === 0) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Aucun entraînements trouvés');
  }

  return entrainements;
}

/**
 * Recherche tous les entraînements d'un utilisateur spécifique
 */
async function getAllByUtilisateur(utilisateurId: Types.ObjectId): Promise<IEntrainement[]> {
  const utilisateur = await UtilisateurRepo.getById(utilisateurId);
  if (!utilisateur) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  const entrainements = await EntrainementRepo.getAllByUtilisateur(utilisateur);
  if (!entrainements || entrainements.length === 0) {
    throw new RouteError(HttpStatusCodes.OK, 'Aucun entraînement trouvé pour cet utilisateur');
  }

  return entrainements;
}

/**
 * Recherche les entraînements filtrés par catégorie
 */
async function getByCategory(category: string): Promise<IEntrainement[]> {
  const entrainements = await EntrainementRepo.getByCategory(category);

  if (entrainements.length === 0) {
    throw new RouteError(
      HttpStatusCodes.OK, 
      `Aucun entraînement trouvé dans cette catégorie. Les catégories disponibles sont : ${CategoriesTypes.join(', ')}`,
    );
  }

  return entrainements;
}

/**
 * Recherche les entraînements filtrés par calories brûlées
 */
async function getByCaloriesBrulees(calories: number): Promise<IEntrainement[]> {

  const entrainements = await EntrainementRepo.getByCaloriesBrulees(calories);

  if (entrainements.length === 0) {
    throw new RouteError(HttpStatusCodes.OK, 'Aucun entraînement trouvé avec ces calories brûlées');
  }

  return entrainements;
}

/**
 * Ajouter un entraînement
 */
async function add(entrainement: IEntrainement, utilisateurId: Types.ObjectId): Promise<IEntrainement> {
  return EntrainementRepo.add(entrainement, utilisateurId);
}

/**
 * Mettre à jour un entraînement
 */
async function update(entrainement: IEntrainement): Promise<IEntrainement> {
  if (!entrainement._id) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'L\'id de l\'entrainement est manquante');
  }

  const persists = await EntrainementRepo.persists(entrainement._id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, ENTRAINEMENT_NOT_FOUND_ERR);
  }

  return EntrainementRepo.update(entrainement);
}

/**
 * Supprimer un entraînement par son id
 */
async function _delete(id: Types.ObjectId, utilisateurId: Types.ObjectId): Promise<void> {
  const entrainement = await EntrainementRepo.deleteById(id, utilisateurId);
  if (!entrainement) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, ENTRAINEMENT_NOT_FOUND_ERR);
  }
}

// **** Export default **** //
export default {
  getOne,
  getAll,
  getAllByUtilisateur,
  getByCategory,
  getByCaloriesBrulees,
  add,
  update,
  delete: _delete,
} as const;
