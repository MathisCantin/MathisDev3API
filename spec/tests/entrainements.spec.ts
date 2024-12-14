import supertest, { Test } from 'supertest';
import TestAgent from 'supertest/lib/agent';

import app from '@src/server';
import Entrainement, { IEntrainement } from '@src/models/Entrainement';
import { USER_NOT_FOUND_ERR } from '@src/services/UtilisateurService';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { Types } from 'mongoose';
const mockify = require('@jazim/mock-mongoose');

// Données fictives pour les tests
const obtenirDonneesBidonEntrainements = (): IEntrainement[] => [
  {
    _id: new Types.ObjectId('60b0dff443bfceb8069a60e7'),
    titre: 'Course Matinale',
    description: 'Course légère pour commencer la journée.',
    duree: 30,
    date: new Date(),
    publique: true,
    categories: ['Cardio'],
    caloriesBrulees: 250,
  },
  {
    _id: new Types.ObjectId('60b0dff443bfceb8069a60e8'),
    titre: 'Séance de Musculation',
    description: 'Séance de musculation pour renforcer les muscles.',
    duree: 60,
    date: new Date(),
    publique: false,
    categories: ['Force'],
    caloriesBrulees: 500,
  },
];

describe('EntrainementRouter', () => {
  let agent: TestAgent<Test>;

  beforeAll(() => {
    agent = supertest.agent(app);
  });

  // Route pour récupérer tous les entrainements
  describe(`"GET:${'/entrainements'}"`, () => {
    it(
      'doit retourner un objet JSON avec tous les entraînements et un code de statut ' +
        `"${HttpStatusCodes.OK}" si la requête est réussie.`,
      async () => {
        const data = obtenirDonneesBidonEntrainements();
        mockify(Entrainement).toReturn(data, 'find');

        const res = await agent.get('/entrainements');
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.entrainements).toEqual(data);
        expect(res.body.errors).toEqual([]);
        expect(res.body.id).toBeDefined();
      }
    );
  });

  // Route pour récupérer un entrainement par ID
  describe(`"GET:${'/entrainements/:id'}"`, () => {
    it(
      'doit retourner un entraînement par ID et un code de statut "' +
        `${HttpStatusCodes.OK}" si la requête est réussie.`,
      async () => {
        const entrainement = obtenirDonneesBidonEntrainements()[0];
        mockify(Entrainement).toReturn(entrainement, 'findById');

        const res = await agent.get(`/entrainements/${entrainement._id!.toString()}`);
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.entrainement).toEqual(entrainement);
        expect(res.body.errors).toEqual([]);
        expect(res.body.id).toBeDefined();
      }
    );

    it(
      'doit retourner une erreur "Entrainement non trouvé" et un code de statut ' +
        `"${HttpStatusCodes.NOT_FOUND}" si l'entraînement n\'est pas trouvé.`,
      async () => {
        mockify(Entrainement).toReturn(null, 'findById');

        const res = await agent.get('/entrainements/nonexistent-id');
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe('Entrainement non trouvé');
        expect(res.body.errors).toEqual([]);
      }
    );
  });

  // Route pour récupérer les entrainements par catégorie
  describe(`"GET:${'/entrainements/categorie/:categorie'}"`, () => {
    it(
      'doit retourner un code de statut "' + `${HttpStatusCodes.OK}" et les entrainements filtrés.`,
      async () => {
        const entrainements = obtenirDonneesBidonEntrainements();
        mockify(Entrainement).toReturn(entrainements, 'find');

        const res = await agent.get('/entrainements/categorie/Cardio');
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.entrainements).toEqual([entrainements[0]]);
      }
    );
  });

  // Route pour ajouter un entrainement
  describe(`"POST:${'/entrainements/:utilisateur'}"`, () => {
    const entrainement = obtenirDonneesBidonEntrainements()[0];
    it(
      'doit retourner un code de statut "' + `${HttpStatusCodes.CREATED}" si l\'entrainement est ajouté.`,
      async () => {
        mockify(Entrainement).toReturn(entrainement, 'save');

        const res = await agent.post('/entrainements/60b0dff443bfceb8069a60e7').send(entrainement);
        expect(res.status).toBe(HttpStatusCodes.CREATED);
        expect(res.body.entrainement).toEqual(entrainement);
      }
    );

    it(
      'doit retourner un code de statut "' +
        `${HttpStatusCodes.BAD_REQUEST}" si des erreurs de validation se produisent.`,
      async () => {
        const entrainementError = { ...entrainement, titre: '' };
        const res = await agent.post('/entrainements/60b0dff443bfceb8069a60e7').send(entrainementError);
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST);
      }
    );
  });

  // Route pour mettre à jour un entrainement
  describe(`"PUT:${'/entrainements'}"`, () => {
    const entrainement = obtenirDonneesBidonEntrainements()[0];
    it(
      'doit retourner un code de statut "' + `${HttpStatusCodes.OK}" si l\'entrainement est mis à jour.`,
      async () => {
        mockify(Entrainement).toReturn(entrainement, 'save');

        const res = await agent.put('/entrainements').send(entrainement);
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.entrainement).toEqual(entrainement);
      }
    );
  });

  // Route pour supprimer un entrainement
  describe(`"DELETE:${'/entrainements/:id'}"`, () => {
    it(
      'doit retourner un code de statut "' + `${HttpStatusCodes.OK}" si l\'entrainement est supprimé.`,
      async () => {
        const entrainement = obtenirDonneesBidonEntrainements()[0];
        mockify(Entrainement).toReturn(entrainement, 'findByIdAndDelete');

        const res = await agent.delete(`/entrainements/${entrainement._id!.toString()}`);
        expect(res.status).toBe(HttpStatusCodes.OK);
        expect(res.body.entrainement).toEqual(entrainement);
      }
    );

    it(
      'doit retourner une erreur "' +
        `${USER_NOT_FOUND_ERR}" et un code de statut "${HttpStatusCodes.NOT_FOUND}" si l'entrainement n\'est pas trouvé.`,
      async () => {
        mockify(Entrainement).toReturn(null, 'findByIdAndDelete');

        const res = await agent.delete('/entrainements/nonexistent-id');
        expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
        expect(res.body.error).toBe(USER_NOT_FOUND_ERR);
      }
    );
  });
});