require("dotenv").config();

import "reflect-metadata";
import express from 'express';
import { createConnection } from 'typeorm';
import { __prod__ } from "./constants";
import { join } from "path";
import { getUser } from "./queries/getUser";

import { Strategy as GitHubStrategy } from 'passport-github';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { User } from './entities/User';
import { Recruiter } from './entities/Recruiter';
//import { Organization } from './entities/Organization';
import { isAuth } from "./isAuth";
import { Question } from "./entities/Question";
import { Answer } from "./entities/Answer";

(async () => {
    await createConnection({
        type: 'postgres',
        url: process.env.POSTGRES_URL,
        entities: [join(__dirname, './entities/*.*')],
        logging: !__prod__,
        synchronize: !__prod__,
        extra: { connectionLimit: 5 }
    });

    //await Organization.create({ name:"testOrganization"}).save();

    const app = express();
    passport.serializeUser(function (user: any, done) {
        done(null, user.accessToken);
    });
    app.use(passport.initialize());
    app.use(cors());
    app.use(express.json());

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: "https://hire-me-api.vercel.app/auth/github/callback"
    },
        async (_, __, profile, cb) => {
            let user = await User.findOne({ where: { githubId: profile.id } })
            if (user) {
                user.name = profile.displayName;
                //await user.save();
            } else {
                user = await User.create({ name: profile.displayName, githubId: profile.id }).save();
            }
            cb(null, { accessToken: jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1y" }) })
        }
    ));

    app.post("/question", isAuth, async (req, res) => {
        const question = await Question.create({
            text: req.body.text,
            creatorId: req.userId,
        }).save();
        res.send({ question });
    });

    app.post("/answer", isAuth, async (req, res) => {
        const answer = await Answer.create({
            text: req.body.text,
            creatorId: req.userId,
            questionId: req.body.questionId,
        }).save();
        res.send({ answer });
    });

    app.get("/question", isAuth, async (_req, res) => {
        const questions = await Question.find();
        res.send({ questions });
    });

    app.get("/recruiter_question", isAuth, async (req, res) => {
        const questions = await Question.find({
            where: { creatorId: req.userId }
        });
        res.send({ questions });
    });

    app.get('/auth/github',
        passport.authenticate('github', { session: false }));

    app.get('/auth/github/callback',
        passport.authenticate('github', { session: false }),
        function (req: any, res) {
            res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
        });

    app.get("/me", async (req, res) => {
        // Bearer 120jdklowqjed021901
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.send({ user: null });
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.send({ user: null });
            return;
        }

        let userId = "";

        try {
            const payload: any = jwt.verify(token, process.env.JWT_SECRET_KEY);
            userId = payload.userId;
        } catch (err) {
            res.send({ user: null });
            return;
        }

        if (!userId) {
            res.send({ user: null });
            return;
        }

        const user = await User.findOne(userId);

        res.send({ user });
    });

    app.get("/", (_req, res) => {
        res.send("HIRE ME!!!");
    });

    app.put(
        "/user",
        isAuth,
        async (req: any, res) => {

            let currentUser = await getUser(req.body.id);

            if (currentUser.isRecruiter != req.body.isRecruiter) {
                await Recruiter.create({ name: currentUser.name, githubId: currentUser.githubId, organizationId: 1 }).save();
            }
            await User.update(req.body.id, req.body);

            res.json({ user: await getUser(req.body.id) });
        }
    );

    app.listen(3000);
})();