import mongoose, { Schema, model, Types } from 'mongoose';

// **** Types **** //
export const CategoriesTypes = ['Cardio', 'Force', 'Endurance', 'Puissance', 'Flexibilité'];

export interface IEntrainement {
  titre: string;
  description: string;
  duree: number;
  date: Date;
  publique: boolean;
  categories: string[];
  repetitions?: number;
  caloriesBrulees: number;
  _id?: Types.ObjectId;
}

// **** Schéma **** //
const EntrainementSchema = new Schema<IEntrainement>({
  titre: {
    type: String,
    required: [true, 'Le titre de l\'entraînement est obligatoire'],
    maxlength: [100, 'Le titre ne doit pas dépasser 100 caractères'],
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne doit pas dépasser 500 caractères'],
  },
  duree: {
    type: Number,
    required: [true, 'La durée de l\'entraînement est obligatoire'],
    min: [1, 'La durée doit être d’au moins 1 minute'],
  },
  date: {
    type: Date,
    required: [true, 'La date de l\'entraînement est obligatoire'],
  },
  publique: {
    type: Boolean,
    required: [true, 'Le statut public/privé est obligatoire'],
  },
  categories: {
    type: [String],
    required: [true, 'Au moins une catégorie est obligatoire'],
    enum: {
      values: CategoriesTypes,
      message: 'La catégorie doit être l\'une des suivantes : ' + CategoriesTypes.join(', '),
    },
  },
  repetitions: {
    type: Number,
    min: [1, 'Le nombre de répétitions doit être supérieur à 0'],
  },
  caloriesBrulees: {
    type: Number,
    required: [true, 'Le nombre de calories brûlées est obligatoire'],
    min: [0, 'Les calories brûlées doivent être égales ou supérieures à 0'],
  },
});

// **** Export du modèle **** //
mongoose.pluralize(null);
export default model<IEntrainement>('Entrainements', EntrainementSchema);
