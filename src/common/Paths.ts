/**
 * Express router paths go here.
 */

export default {
  Base: '/api',
  Documentation: {
    Base: '/docs',
    Get: '/',
  },
  GenerateToken: {
    Base: '/generertoken',
    Get: '/',
  },
  Utilisateurs: {
    Base: '/utilisateurs',
    GetId: '/id',
    Add: '/add',
  },
  Entrainements: {
    Base: '/entrainements',
    GetAll: '/',
    GetAllByUtilisateur: '/utilisateur/:utilisateur',
    GetById: '/:id',
    GetByCategory: '/categorie/:categorie',
    GetByCaloriesBrulees: '/calories/:calorie',
    Add: '/:utilisateur',
    Update: '/',
    Delete: '/:id',
  },
} as const;
