# Documentation de l'API

## Installation de l'API sur un poste local

### Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :
- **Node.js** version 16.6.0 ou supérieure (vous pouvez télécharger Node.js ici : https://nodejs.org/)
- **MongoDB** Un service de base de données MongoDB.

### Étapes d'installation

# Clonez le dépôt Git
git clone https://github.com/votre-utilisateur/votre-repository.git
cd votre-repository

# Installez les dépendances
npm install

### Étapes de création de la base de données.

##Crée une base de données

##Crée deux colleciton pour les utilisateurs et entrainements

#Exporter les données dans la colleciton correspondeance qui se retrouve dans le dossier /dev/utilisateurs.json et /dev/entrainements.json

# Modifiez le fichier `.env` et ajoutez vos informations sensibles
# Exemple de fichier `.env` :
# MONGO_URI=mongodb://localhost:27017/nom_de_votre_base_de_donnees
# PORT=3000
# COOKIE_SECRET=secret_unique

# Compilez l'API
npm run build

# Démarrez l'API
npm start

# Url de l'api en ligne: https://mathisdev3api.onrender.com/
