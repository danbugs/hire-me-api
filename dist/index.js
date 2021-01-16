"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe").config();
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const path_1 = require("path");
const User_1 = require("./entities/User");
const passport_github_1 = require("passport-github");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: 'postgres',
        database: 'hire-me',
        username: 'postgres',
        password: 'postgres',
        entities: [path_1.join(__dirname, './entities/*.*')],
        logging: !constants_1.__prod__,
        synchronize: !constants_1.__prod__
    });
    const app = express_1.default();
    passport_1.default.serializeUser(function (user, done) {
        done(null, user.accessToken);
    });
    app.use(passport_1.default.initialize());
    app.use(cors_1.default({ origin: '*' }));
    app.use(express_1.default.json());
    passport_1.default.use(new passport_github_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3002/auth/github/callback"
    }, (_, __, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        let user = yield User_1.User.findOne({ where: { githubId: profile.id } });
        if (user) {
            user.name = profile.displayName;
            yield user.save();
        }
        else {
            user = yield User_1.User.create({ name: profile.displayName, githubId: profile.id }).save();
        }
        cb(null, { accessToken: jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1y" }) });
    })));
    app.get('/auth/github', passport_1.default.authenticate('github', { session: false }));
    app.get('/auth/github/callback', passport_1.default.authenticate('github', { session: false }), function (req, res) {
        res.redirect(`http://localhost:3002/auth/${req.user.accessToken}`);
    });
    app.get("/", (_req, res) => {
        res.send("it's working!");
    });
    app.listen(3002, () => {
        console.log("listening on localhost:3002");
    });
}))();
//# sourceMappingURL=index.js.map