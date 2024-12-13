import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';

/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 *
 * @param {Request} req - La requête au serveur
 * @param {Response} res - La réponse du serveur
 * @param {NextFunction} next - La fonction a appeler pour continuer le processus
 */
function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  // Ne pas vérifier le token si l'url est celui de generatetoken
  const lastPartOfUrl = req.url.split('/').at(-1);
  if (lastPartOfUrl === 'generatetoken') {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token == null) {
    res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('La variable d\'environnement JWT_SECRET n\'est pas déféni');
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      res.sendStatus(HttpStatusCodes.FORBIDDEN);
      return;
    }
  
    next();
  });
  
}  

export default authenticateToken;