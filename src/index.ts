import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();
const IN_PROD = process.env.NODE_ENV === 'production';

const app = express();
app.disable('x-powered-by');

app.use(session({
     secret: crypto.randomBytes(20).toString('hex'),
     resave: false,
     saveUninitialized: false,
     cookie: {
          maxAge: 1000 * 60 * 60 * 2,   // 2 hours
          sameSite: true,
          secure: IN_PROD,
     },
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT
import loadLoginConfig from './passport-config/userLoginConfig';
loadLoginConfig(passport);

// DATABASE
const DB_CONNECTION = IN_PROD ? process.env.DB_CONNECTION_PRODUCTION
                         : process.env.DB_CONNECTION_TEST;
mongoose.connect(DB_CONNECTION as string,
     { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set('useCreateIndex', true);
const db = mongoose.connection;
// tslint:disable-next-line: no-console
db.on('error', (error: any) => console.error(error));
// tslint:disable-next-line: no-console
db.once('open', () => console.log('connected to database'));

// ROUTES
import userCardRouter from './routes/userCardRoutes';
app.use('/api/userCards', userCardRouter);

import userDetailsRouter from './routes/userDetailsRoutes';
app.use('/api/userDetails', userDetailsRouter);

import locationsRouter from './routes/locationRoutes';
app.use('/api/locations', locationsRouter);

import friendListsRouter from './routes/friendListsRoutes';
app.use('/api/friendLists', friendListsRouter);

import authRouter from './routes/authRoutes';
app.use('/api/auth', authRouter);

export default app;

