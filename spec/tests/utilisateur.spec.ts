import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';
import { Types } from 'mongoose';

import app from '@src/server';
import Utilisateur, { IUtilisateur } from '@src/models/Utilisateur';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { USER_NOT_FOUND_ERR } from '@src/services/UtilisateurService';

const mockify = require('@jazim/mock-mongoose');

// Données fictives pour les tests
const obtenirDonneesBidonUtilisateur = () => {
  return {
    nom: 'utilisateur',
    email: 'utilisateur@example.com',
    motDePasse: 'StrongPassword123!',
    dateInscription: new Date(),
    entrainements: [] as Types.ObjectId[],
    _id: new Types.ObjectId('66b0dff443bfceb8069a60e7'),
  };
};

// Tests des routes des utilisateurs
describe('Routes Utilisateur', () => {
  let agent: TestAgent<Test>;

  beforeAll(async () => {
    agent = supertest.agent(app);

    const response = await agent
      .post('/api/generertoken')
      .send({
        email: 'mathisCantin@example.com',
        motDePasse: 'WeshSalors@2',
      });

      console.log(response.status);
    if (response.status === HttpStatusCodes.OK && response.body.token) {
    }
  });

  // Test pour récupérer un utilisateur par email et mot de passe (POST /utilisateurs/id)
  describe(`"POST:${'/api/utilisateurs/id'}"`, () => {
    const UTILISATEUR_FICTIF = obtenirDonneesBidonUtilisateur();
    const MESSAGE_ERREUR = 'Email et mot de passe requis.';

    const appelerApi = async (email: string, motDePasse: string) =>
      agent
        .post('/api/utilisateurs/id')
        .set(
          'Authorization',
          `Bearer ${'eyJhbGciOiJIUzI1NiJ9.bWF0aGlzQ2FudGluQGV4YW1wbGUuY29t.TCWfCq_ZwkYQGs2_zALlLkdB_q7R-bXcK9VAFsOE8T0'}`
        )
        .send({ email, motDePasse });

    it(`doit retourner le statut "${HttpStatusCodes.OK}" si la requête réussit`, async () => {
      mockify(Utilisateur).toReturn(UTILISATEUR_FICTIF, 'findOne');

      const res = await appelerApi(UTILISATEUR_FICTIF.email, UTILISATEUR_FICTIF.motDePasse);

      expect(res.status).toBe(HttpStatusCodes.OK);
      console.log(res.body);
      expect(res.body.id).toEqual(UTILISATEUR_FICTIF._id.toString());
    });

    it(`doit retourner une erreur "${MESSAGE_ERREUR}" avec le statut "${HttpStatusCodes.BAD_REQUEST}" si l'email ou le mot de passe est manquant`, async () => {
      const res = await appelerApi('', '');

      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      expect(res.body.error).toBe(MESSAGE_ERREUR);
    });

    it(`doit retourner une erreur si l'utilisateur n'est pas trouvé avec le statut "${HttpStatusCodes.NOT_FOUND}"`, async () => {
      mockify(Utilisateur).toReturn(null, 'findOne');

      const res = await appelerApi(UTILISATEUR_FICTIF.email, UTILISATEUR_FICTIF.motDePasse);

      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
      expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
    });
  });

  // Test pour ajouter un utilisateur (POST /utilisateurs/add)
  describe(`"POST:${'/api/utilisateurs/add'}"`, () => {
    const MESSAGE_ERREUR = `Utilisateur requis`;
    const UTILISATEUR_FICTIF = obtenirDonneesBidonUtilisateur();

    const appelerApi = async (utilisateur: IUtilisateur | null) =>
      agent.post('/api/utilisateurs/add').send({ utilisateur });

    it(`doit retourner le statut "${HttpStatusCodes.CREATED}" si la requête réussit`, async () => {
      mockify(Utilisateur).toReturn(UTILISATEUR_FICTIF, 'save');

      const res = await appelerApi(UTILISATEUR_FICTIF);

      expect(res.status).toBe(HttpStatusCodes.CREATED);
      expect(res.body.utilisateur?.nom).toEqual(UTILISATEUR_FICTIF.nom);
      expect(res.body.utilisateur?.email).toEqual(UTILISATEUR_FICTIF.email);
    });

    it(`doit retourner une erreur "${MESSAGE_ERREUR}" avec le statut "${HttpStatusCodes.BAD_REQUEST}" si l'utilisateur est manquant`, async () => {
      const res = await appelerApi(null);

      expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      console.log(res.body.error);
      expect(res.body.error).toBe(MESSAGE_ERREUR);
    });
  });
});