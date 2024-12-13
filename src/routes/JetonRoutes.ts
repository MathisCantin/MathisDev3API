import JetonService from '@src/services/JetonService';
import { isUserLogin } from '@src/models/Utilisateur';
import { IReq, IRes } from './common/types';

/**
 * Génère un jeton pour un utilisateur authentifié
 *
 * @param {IReq} req - La requête contenant les informations utilisateur (email et mdp)
 * @param {IRes} res - La réponse qui sera renvoyée
 */
async function generateToken(req: IReq, res: IRes) {
  const { email, motDePasse } = req.body;
  const utilisateur = await isUserLogin(email as string, motDePasse as string);

  if (!utilisateur) { 
    res.status(401).send({ error: 'Email ou mot de passe incorrect.' });
    return;
  }

  const token = await JetonService.generateToken(utilisateur);
  res.send({ token });
}

export default {
  generateToken,
} as const;