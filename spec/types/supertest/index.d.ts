import { IUtilisateur } from '@src/models/Utilisateur';
import { IEntrainement } from '@src/models/Entrainement';

import 'supertest';

declare module 'supertest' {
  export interface Response {
    headers: Record<string, string[]>;

    body: {
      error?: string;
      errors: ArrayLike<string>;
      utilisateur?: IUtilisateur;
      utilisateurs?: IUtilisateur[];
      entrainement?: IEntrainement;
      entrainements?: IEntrainement[];
      success?: boolean;
      id?: string;
    };
  }
}
