import express from 'express';
import passport from 'passport';
import UserLogin from '../models/userLogin';
const router = express.Router();

// TODO: check generation of session here and in index.html
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
                res.json({ user: account });
            });
        });
    });
});

router.post('/login', (req: any, res: any, next: any) => {
    passport.authenticate('local', (hashErr, user, info) => {
        if (hashErr) {
            return res.json({ message: hashErr });
        }
        if (!user) {
            return res.json({ message: info.message });
        }

        req.session.save((err: any) => {
            if (err) {
                return next(err);
            }
            res.json({ user });
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

router.get('/logout', (req: any, res: any, next: any) => {
    req.logout();
    req.session.save((err: any) => {
        if (err) {
            return next(err);
        }
        res.status(200);
    });
});

export default router;
