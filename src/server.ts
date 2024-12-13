import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import 'express-async-errors';
import BaseRouter from '@src/routes';
import Paths from '@src/common/Paths';
import EnvVars from '@src/common/EnvVars';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/classes';
import { NodeEnvs } from '@src/common/misc';
import cors from 'cors';

// **** Variables **** //
const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());  // Body parser for JSON
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security middleware
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// CORS (Cross-Origin Resource Sharing) setup
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add routes, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// **** Front-End Content **** //

// Set views directory (HTML)
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static directory (JS, CSS files)
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Redirect to API docs page by default
app.get('/', (_: Request, res: Response) => {
  return res.redirect('api/docs');
});

// **** Start the Server **** //

// Use the environment variable for port or fallback to 3000
const port = EnvVars.Port || 3000;
app.listen(port, () => {
  logger.info(`Express server started on port: ${port}`);
});

// **** Export default **** //
export default app;