import mongoose, { Schema, model, Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';

// **** Types **** //
export interface IUtilisateur {
  nom: string;
  email: string;
  motDePasse: string;
  dateInscription: Date;
  entrainements?: Types.ObjectId[];
  _id?: Types.ObjectId;
}

// **** Schéma **** //
const UtilisateurSchema = new Schema<IUtilisateur>({
  nom: {
    type: String,
    required: [true, 'Le nom de l\'utilisateur est obligatoire'],
    maxlength: [100, 'Le nom ne doit pas dépasser 100 caractères'],
  },
  email: {
    type: String,
    required: [true, 'L\'adresse email est obligatoire'],
    unique: true,
    validate: {
      validator: function (value: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'L\'adresse email est invalide',
    },
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    validate: {
      validator: function (value: string) {
        if (value?.startsWith('$2b$')) {
          return true; // Si mdp déja haché, pas de validation
        }
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(value);
      },
      message:
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre, un caractère spécial (@$!%*?&) et sans espace',
    },
  },
  dateInscription: {
    type: Date,
    default: Date.now,
  },
  entrainements: [
    {
      type: mongoose.Schema.Types.String,
      ref: 'entrainements',
    },
  ],
});

// Middleware pour hacher le mot de passe avant sauvegarde
UtilisateurSchema.pre('save', async function (next) {
  if (this.isModified('motDePasse')) {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  }
  next();
});

//Vérifier si l'utilisateur est connecter
export async function isUserLogin(email: string, motDePasse: string): Promise<IUtilisateur | null> {
  const UtilisateurModel = mongoose.models.Utilisateurs as Model<IUtilisateur>;
  const utilisateur = await UtilisateurModel.findOne({ email });

  if (!utilisateur) { return null;}

  const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
  return motDePasseValide ? utilisateur : null;
}

// **** Export du modèle **** //
mongoose.pluralize(null);
export default model<IUtilisateur>('Utilisateurs', UtilisateurSchema);
