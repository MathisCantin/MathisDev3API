import { Router, Request, Response, NextFunction } from 'express';
import jetValidator from 'jet-validator';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import Paths from '../common/Paths';

import EntrainementRoutes from './EntrainementRoutes';
import UtilisateurRoutes from './UtilisateurRoutes';
import JetonRoutes from './JetonRoutes';

import Entrainement from '@src/models/Entrainement';
import Utilisateur from '@src/models/Utilisateur';

import authenticateToken from '../util/authenticateToken';

import swaggerUi, { JsonObject } from 'swagger-ui-express';
import YAML from 'yamljs';

const apiRouter = Router(),
  validate = jetValidator();

// Interface for Entrainement
interface EntrainementRequestBody {
  entrainement: {
    titre: string;
    description: string;
    duree: number;
    date: string;
    publique: boolean;
    categories: string[];
    caloriesBrulees: number;
  };
}

// Interface for Utilisateur
interface UtilisateurRequestBody {
  utilisateur: {
    email: string;
    motDePasse: string;
    nom: string;
    prenom: string;
  };
}

// Validation d'un entrainement
function validateEntrainement(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as EntrainementRequestBody;

  if (!body.entrainement) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Entrainement requis' })
      .end();
    return;
  }

  const nouvelEntrainement = new Entrainement(body.entrainement);
  const error = nouvelEntrainement.validateSync();

  if (error) {
    res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
    return;
  }

  next();
}

// Validation d'un utilisateur
function validateUtilisateur(req: Request, res: Response, next: NextFunction): void {
  const body = req.body as UtilisateurRequestBody;

  if (!body.utilisateur) {
    res
      .status(HttpStatusCodes.BAD_REQUEST)
      .send({ error: 'Utilisateur requis' })
      .end();
    return;
  }

  const nouvelUtilisateur = new Utilisateur(body.utilisateur);
  const error = nouvelUtilisateur.validateSync();

  if (error) {
    res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
    return;
  }

  next();
}

// ** Documentation Router ** //
const documentationRouter = Router();

const swaggerDocument: JsonObject = YAML.load('src/util/documentation.yaml') as JsonObject;

documentationRouter.use(swaggerUi.serve, swaggerUi.setup(swaggerDocument));

apiRouter.use(Paths.Documentation.Base, documentationRouter);

// ** Token Router ** //
const tokenRouter = Router();

// Générer un token
tokenRouter.post(Paths.GenerateToken.Get, JetonRoutes.generateToken);

// Ajoute le TokenRouter  
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);

// ** Utilisateur Router ** //
const utilisateurRouter = Router();

// Recherche l'id d'un utilisateur
utilisateurRouter.post(Paths.Utilisateurs.GetId, UtilisateurRoutes.getId);

//Ajoute un utilisateur
utilisateurRouter.post(Paths.Utilisateurs.Add, validateUtilisateur, UtilisateurRoutes.add);

// Ajoute le utilisateurRouter  
apiRouter.use(Paths.Utilisateurs.Base, utilisateurRouter);

// ** Entrainement Router ** //
const entrainementRouter = Router();

// Lire tous les entrainements publics
entrainementRouter.get(Paths.Entrainements.GetAll, EntrainementRoutes.getAll);

// Lire un entrainement par ID
entrainementRouter.get(Paths.Entrainements.GetById, validate(['id', 'string', 'params']), EntrainementRoutes.getOne);

// Lire les entrainements filtrés par catégorie
entrainementRouter.get(Paths.Entrainements.GetByCategory, validate(['categorie', 'string', 'params']), EntrainementRoutes.getByCategory);

// Lire les entrainements filtrés par calorie
entrainementRouter.get(Paths.Entrainements.GetByCaloriesBrulees, validate(['calorie', 'string', 'params']), EntrainementRoutes.getByCalorie);

// Lire les entrainements d'un utilisateur
entrainementRouter.get(Paths.Entrainements.GetAllByUtilisateur, authenticateToken, validate(['utilisateur', 'string', 'params']), EntrainementRoutes.getAllByUtilisateur);

// Ajouter un nouvel entrainement
entrainementRouter.post(Paths.Entrainements.Add, authenticateToken, validate(['utilisateur', 'string', 'params']), validateEntrainement, EntrainementRoutes.add);

// Mettre à jour un entrainement
entrainementRouter.put(Paths.Entrainements.Update, authenticateToken, validateEntrainement, EntrainementRoutes.update);

// Supprimer un entrainement
entrainementRouter.delete(Paths.Entrainements.Delete, authenticateToken, validate(['id', 'string', 'params']), EntrainementRoutes.delete);

// Ajoute le EntrainementRouter
apiRouter.use(Paths.Entrainements.Base, entrainementRouter);

// ** Export default ** //
export default apiRouter;