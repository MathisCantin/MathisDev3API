import Entrainement, { IEntrainement } from '@src/models/Entrainement';
import Utilisateur, { IUtilisateur } from '@src/models/Utilisateur';
import UtilisateurService from '@src/services/UtilisateurService';
import { Types } from 'mongoose';

/**
 * Vérifie si l'entraînement existe.
 * @param id - L'ID de l'utilisateur
 */
async function persists(id: Types.ObjectId): Promise<boolean> {
  const entrainement = await Entrainement.findById(id);
  return entrainement !== null;
}

/**
 * Lire tous les entraînements publics.
 */
async function getAll(): Promise<IEntrainement[]> {
  return await Entrainement.find({ publique: true });
}

/**
 * Lire tous les entraînements d'un utilisateur spécifique.
 * @param id - L'ID de l'utilisateur
 */
async function getAllByUtilisateur(utilisateur: IUtilisateur): Promise<IEntrainement[]> {
  return Entrainement.find({ _id: { $in: utilisateur.entrainements } });
}

/**
 * Lire un entraînement par son ID.
 * Si l'entraînement est privé, une erreur avec un code HTTP 403 est levée.
 * 
 * @param id - L'ID de l'utilisateur dont on veut récupérer les entraînements
 */
async function getOne(id: Types.ObjectId): Promise<IEntrainement | null> {
  console.log(id);
  console.log(await Entrainement.findOne({_id: id}))

  return await Entrainement.findOne({_id: id});
}

/**
 * Lire les entraînements publics filtrés par catégorie.
 */
async function getByCategory(category: string): Promise<IEntrainement[]> {
  return await Entrainement.find({ publique: true, categories: { $in: [category] } });
}

/**
 * Lire les entraînements publics filtrés par le nombre de calories brûlées.
 * @param calories - Le nombre de calories pour filtrer les entraînements
 */
async function getByCaloriesBrulees(calories: number): Promise<IEntrainement[]> {
  return await Entrainement.find({ publique: true, caloriesBrulees: { $gte: calories } });
}

/**
 * Ajouter un entraînement à un utilisateur.
 */
async function add(entrainement: IEntrainement, utilisateurId: Types.ObjectId): Promise<IEntrainement> {
  const nouvelEntrainement = new Entrainement(entrainement);
  nouvelEntrainement.date = new Date();
  await nouvelEntrainement.save();

  const utilisateur = await UtilisateurService.getById(utilisateurId);
  utilisateur.entrainements = utilisateur.entrainements ?? [];
  utilisateur.entrainements.push(nouvelEntrainement._id);
  await UtilisateurService.update(utilisateur);

  return nouvelEntrainement;
}

/**
 * Mettre à jour un entraînement.
 */
async function update(entrainement: IEntrainement): Promise<IEntrainement> {
  const entrainementToUpdate = await Entrainement.findById(entrainement._id);
  
  if (entrainementToUpdate === null) {
    throw new Error('Entraînement non trouvé');
  }
  Object.assign(entrainementToUpdate, entrainement);
  await entrainementToUpdate.save();

  return entrainementToUpdate;
}

/**
 * Supprimer un entraînement d'un utilisateur.
 */
async function deleteById(id: Types.ObjectId, utilisateurId: Types.ObjectId): Promise<IEntrainement | null> {
  const deletedEntrainement = await Entrainement.findByIdAndDelete(id);
  if (!deletedEntrainement) { return null; }

  const utilisateur = await Utilisateur.findById(utilisateurId);
  if (!utilisateur) { return null;}

  // Retirer l'entraînement de la liste des entraînements de l'utilisateur
  utilisateur.entrainements = utilisateur.entrainements?.filter(
    (entrainementId) => entrainementId.toString() !== id.toString(),
  );
  await utilisateur.save();

  return deletedEntrainement;
}

// **** Export default **** //
export default {
  persists,
  getAll,
  getAllByUtilisateur,
  getOne,
  getByCategory,
  getByCaloriesBrulees,
  add,
  update,
  deleteById,
} as const;
