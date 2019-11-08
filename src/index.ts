import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// PASSPORT
import loadLoginConfig from './passport-config/userLoginConfig';
loadLoginConfig(passport);

// DATABASE
mongoose.connect(process.env.REACT_APP_DB_CONNECTION_LOCAL as string,
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

app.listen(process.env.PORT || 3000, () => {
// tslint:disable-next-line: no-console
    console.log(
        `Climbing partners is running: http://localhost:${process.env.PORT || 3000}`,
    );
});

