import Utilisateur, { IUtilisateur } from '@src/models/Utilisateur';
import { Types } from 'mongoose';
import { RouteError } from '@src/common/classes';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { USER_NOT_FOUND_ERR } from '@src/services/UtilisateurService';

/**
 * Vérifie si l'utilisateur existe.
 */
async function persists(id: Types.ObjectId): Promise<boolean> {
  const utilisateur = await Utilisateur.findById(id);
  return utilisateur !== null;
}

/**
 * Lire un utilisateur par email et mot de passe.
 */
async function getOne(email: string): Promise<IUtilisateur | null> {
  return await Utilisateur.findOne({ email: email});
}

/**
 * Lire un utilisateur par son ID.
 */
async function getById(id: Types.ObjectId): Promise<IUtilisateur | null> {
  return await Utilisateur.findById(id);
}

/**
 * Lire tous les utilisateurs.
 */
async function getAll(): Promise<IUtilisateur[]> {
  return await Utilisateur.find();
}

/**
 * Ajouter un nouvel utilisateur.
 */
async function add(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  const existingUser = await Utilisateur.findOne({ email: utilisateur.email });
  if (existingUser) {
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, 'Email déjà utilisé');
  }

  const newUser = new Utilisateur(utilisateur);
  await newUser.save();
  return newUser;
}

/**
 * Mettre à jour un utilisateur.
 */
async function update(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  const userToUpdate = await Utilisateur.findById(utilisateur._id);
  if (!userToUpdate) { throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);}

  Object.assign(userToUpdate, utilisateur);
  await userToUpdate.save();
  return userToUpdate;
}

// **** Export default **** //
export default {
  persists,
  getOne,
  getById,
  getAll,
  add,
  update,
} as const;