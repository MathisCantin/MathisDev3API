import { Response } from 'supertest';
import { Types } from 'mongoose';
import { IUtilisateur } from '@src/models/Utilisateur';
import { IEntrainement } from '@src/models/Entrainement';

// Misc
export type TReqBody = Record<string, unknown>;
export type TRes = Omit<Response, 'body'> & { body: {
  error?: string;
  errors: ArrayLike<string>;
  id: Types.ObjectId;
  utilisateur?: IUtilisateur;
  utilisateurs?: IUtilisateur[];
  entrainement?: IEntrainement;
  entrainements?: IEntrainement[];
}};
export type TApiCb = (res: TRes) => void;
