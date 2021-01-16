require("dotenv-safe").config();

import "reflect-metadata";
import express from 'express';
import { createConnection } from 'typeorm';
import { __prod__ } from "./constants";
import { join } from "path";
import { User } from "./entities/User";

import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cors from 'cors';

(async () => {
    await createConnection({
        type: 'postgres',
        database: 'hire-me',
        username: 'postgres',
        password: 'postgres',
        entities: [join(__dirname, './entities/*.*')],
        logging: !__prod__,
        synchronize: !__prod__
    });

    const app = express();
    passport.serializeUser(function (user: any, done) {
        done(null, user.accessToken);
    });
    app.use(passport.initialize());
    app.use(cors({ origin: '*' }));
    app.use(express.json());

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: "http://localhost:3002/auth/github/callback"
    },
        async (_, __, profile, cb) => {
            let user = await User.findOne({ where: { githubId: profile.id } })
            if (user) {
                user.name = profile.displayName;
                await user.save();
            } else {
                user = await User.create({ name: profile.displayName, githubId: profile.id }).save();
            }
            cb(null, { accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1y" }) })
        }
    ));

    app.get('/auth/github',
        passport.authenticate('github', { session: false }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { session: false }),
        function (req: any, res) {
            res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
        });

    app.get("/", (_req, res) => {
        res.send("it's working!");
    });

    app.listen(3002, () => {
        console.log("listening on localhost:3002")
    });
})();