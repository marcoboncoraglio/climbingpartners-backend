import express from 'express';
import passport from 'passport';
import UserLogin from '../models/userLogin';
const router = express.Router();

router.post('/register', (req: any, res: any, next: any) => {
    UserLogin.register(new UserLogin({ username: req.body.username }),
        req.body.password, (err, account) => {
            if (err) {
                return res.json({ error: err.message });
            }

            passport.authenticate('local')(req, res, () => {

                req.session.save((err: any) => {
                    if (err) {
                        return next(err);
                    }

                    res.status(201).json({ id: account._id });
                });

            });
        });
});

router.post('/login', (req: any, res: any, next: any) => {
    passport.authenticate('local', (hashErr, user, info) => {
        if (hashErr) {
            return res.status(401).json({ message: hashErr });
        }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.login(user, (err: any) => {
            if (err) { return next(err); }
            res.status(200).json({ id: user.id });
        });

    })(req, res, next);
});

/*
router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/');
    });
*/

router.post('/logout', (req: any, res: any, next: any) => {

    req.session.destroy((err: any) => {
        if (err) {
            return next(err);
        }
    });

    req.logout();

    res.status(200).send('Logged out');
});

export default router;
