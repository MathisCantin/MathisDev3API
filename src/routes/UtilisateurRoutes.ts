import HttpStatusCodes from '@src/common/HttpStatusCodes';
import UserService from '@src/services/UtilisateurService';
import { IUtilisateur } from '@src/models/Utilisateur';
import { IReq, IRes } from './common/types';

/**
 * Lire un utilisateur par email et mdp
 */
async function getId(req: IReq, res: IRes) {
  const { email, motDePasse } = req.body;

  if (!email || !motDePasse) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({ error: 'Email et mot de passe requis.' });
    return;
  }

  const utilisateur = await UserService.getOne(email as string, motDePasse as string);
  
  const id = utilisateur?._id;
  res.status(HttpStatusCodes.OK).json({ id });
}

/**
 * Ajouter un nouvel utilisateur.
 */
async function add(req: IReq<{ utilisateur: IUtilisateur }>, res: IRes) {
  let { utilisateur } = req.body;
  utilisateur = await UserService.add(utilisateur);
  res.status(HttpStatusCodes.CREATED).json({ utilisateur });
}

// **** Export default **** //
export default {
  add,
  getId,
} as const;
