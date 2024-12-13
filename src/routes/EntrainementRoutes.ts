import HttpStatusCodes from '@src/common/HttpStatusCodes';
import EntrainementService from '@src/services/EntrainementService';
import { IEntrainement } from '@src/models/Entrainement';
import { IReq, IRes } from './common/types';
import { Types } from 'mongoose';

/**
 * Lire un entraînement par son ID.
 */
async function getOne(req: IReq, res: IRes) {
  const id = req.params.id as Types.ObjectId;
  const entrainement = await EntrainementService.getOne(id);
  res.status(HttpStatusCodes.OK).json({ entrainement });
}

/**
 * Lire tous les entraînements publics.
 */
async function getAll(_: IReq, res: IRes) {
  const entrainements = await EntrainementService.getAll();
  res.status(HttpStatusCodes.OK).json({ entrainements });
}

/**
 * Lire les entraînements filtrés par catégorie.
 */
async function getByCategory(req: IReq, res: IRes) {
  const { categorie } = req.params;
  const entrainements = await EntrainementService.getByCategory(categorie as string);
  res.status(HttpStatusCodes.OK).json({ entrainements });
}

/**
 * Lire les entraînements filtrés par calories.
 */
async function getByCalorie(req: IReq, res: IRes) {
  const { calorie } = req.params;
  const entrainements = await EntrainementService.getByCaloriesBrulees(calorie as number);
  res.status(HttpStatusCodes.OK).json({ entrainements });
}

/**
 * Lire les entraînements d'un utilisateur.
 */
async function getAllByUtilisateur(req: IReq, res: IRes) {
  const utilisateurId = req.params.utilisateur as Types.ObjectId;
  const entrainements = await EntrainementService.getAllByUtilisateur(utilisateurId);
  res.status(HttpStatusCodes.OK).json({ entrainements });
}

/**
 * Ajouter un nouvel entraînement.
 */
async function add(req: IReq<{ entrainement: IEntrainement }>, res: IRes) {
  console.log("Test2");

  const utilisateurId = req.params.utilisateur as Types.ObjectId;
  console.log("Test1");

  let { entrainement } = req.body;
  entrainement = await EntrainementService.add(entrainement, utilisateurId);
  console.log("Test");
  res.status(HttpStatusCodes.CREATED).json({ entrainement });
}

/**
 * Mettre à jour un entraînement.
 */
async function update(req: IReq<{ entrainement: IEntrainement }>, res: IRes) {
  let { entrainement } = req.body;
  entrainement = await EntrainementService.update(entrainement);
  res.status(HttpStatusCodes.OK).json({ entrainement });
}

/**
 * Supprimer un entraînement.
 */
async function delete_(req: IReq, res: IRes) {
  const utilisateurId = req.query.utilisateur as Types.ObjectId;
  const id = req.params.id as Types.ObjectId;
  await EntrainementService.delete(id, utilisateurId);
  res.status(HttpStatusCodes.OK).send();
}

// **** Export default **** //
export default {
  getAll,
  add,
  update,
  delete: delete_,
  getOne,
  getByCategory,
  getByCalorie,
  getAllByUtilisateur,
} as const;
