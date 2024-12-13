import { IUtilisateur } from '@src/models/Utilisateur';
import UserService from './UtilisateurService';
import jwt from 'jsonwebtoken';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';

/**
 * Générer un jeton pour un utilisateur.
 *
 * @param {IUtilisateur} utilisateur - L'utilisateur demandant le jeton
 * @returns {Promise<string>} - Le jeton, sinon une chaine vide si pas authentifié
 */
async function generateToken(utilisateur: IUtilisateur): Promise<string> {
  const utilisateurBD = (await UserService.getAll()).find(
    (user) => user.email === utilisateur.email,
  );

  if (utilisateurBD && utilisateurBD.motDePasse === utilisateur.motDePasse) {
    const jwtSecret = process.env.JWT_SECRET;
  
    if (!jwtSecret) {
      throw new Error('La variable d\'environnement JWT_SECRET n\'est pas déféni');
    }
  
    return jwt.sign(utilisateur.email, jwtSecret);
  } else {
    return '';
  }
}

// **** Export default **** //
export default {
  generateToken,
} as const;