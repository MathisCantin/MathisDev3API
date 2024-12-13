import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import UserRepo from '@src/repos/UtilisateurRepo';
import { IUtilisateur } from '@src/models/Utilisateur';

export const USER_NOT_FOUND_ERR = 'Utilisateur non trouvé';

/**
 * Recherche un utilisateur par email et mot de passe.
 */
async function getOne(email: string, mdp: string): Promise<IUtilisateur | null> {
  const utilisateur = await UserRepo.getOne(email);
  if (!utilisateur) { throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);}
  const bonMdp = await bcrypt.compare(mdp, utilisateur.motDePasse);
  if (!bonMdp) { throw new RouteError(HttpStatusCodes.UNAUTHORIZED, 'Email ou mot de passe incorrect.');};
  return utilisateur;
}

/**
 * Recherche un utilisateur par son id
 */
async function getById(id: Types.ObjectId): Promise<IUtilisateur> {
  const utilisateur = await UserRepo.getById(id);
  if (!utilisateur) { throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR); }
  return utilisateur;
}


/**
 * Recherche tous les utilisateurs
 */
async function getAll(): Promise<IUtilisateur[]> {
  const utilisateurs = await UserRepo.getAll();
  if (!utilisateurs || utilisateurs.length === 0) { throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Aucun utilisateurs trouvés'); }
  return utilisateurs;
}

/**
 * Ajouter un utilisateur
 */
async function add(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  return UserRepo.add(utilisateur);
}

/**
 * Mettre à jour un utilisateur
 */
async function update(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  if (!utilisateur._id) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'L\'id de l\'utilisateur est requis');
  }
  
  const persists = await UserRepo.persists(utilisateur._id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }

  return UserRepo.update(utilisateur);
}


// **** Export default **** //
export default {
  getOne,
  getById,
  getAll,
  add,
  update,
} as const;