import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';

const cors = require('cors');
const jwt = require('jsonwebtoken');

dotenv.config();
const IN_PROD = process.env.NODE_ENV === 'production';
const PROTECT_ROUTES = true;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();

app.use(express.json());

app.use(helmet());
app.use(cors(corsOptions));
app.use(passport.initialize());

// PASSPORT
import loadLoginConfig from './passport-config/userLoginConfig';
loadLoginConfig(passport);

// DATABASE
const DB_CONNECTION = IN_PROD
  ? process.env.DB_CONNECTION_PRODUCTION
  : process.env.DB_CONNECTION_TEST;
mongoose.connect(DB_CONNECTION as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
// tslint:disable-next-line: no-console
db.on('error', (error: any) => console.error(error));
// tslint:disable-next-line: no-console
db.once('open', () => console.log('connected to database'));

// Authenticate Token middleware
function authenticateToken(req: any, res: any, next: any) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  // TODO: jwt malformed for google login
  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, obj: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.userId = obj.id;
      next();
    }
  );
}

const openPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/google', '/api/auth/google/redirect'];

if (PROTECT_ROUTES || IN_PROD) {
  app.all('*', (req, res, next) => {
    if (openPaths.some((path) => path === req.path)) {
      next();
    } else {
      authenticateToken(req, res, next);
    }
  });
}

// ROUTES
import authRouter from './routes/authRoutes';
app.use('/api/auth', authRouter);

import userCardRouter from './routes/userCardRoutes';
app.use('/api/users/cards', userCardRouter);

import userDetailsRouter from './routes/userDetailsRoutes';
app.use('/api/users/details', userDetailsRouter);

import locationsRouter from './routes/locationRoutes';
app.use('/api/locations', locationsRouter);

import friendListsRouter from './routes/friendListsRoutes';
app.use('/api/friends', friendListsRouter);

export default app;
