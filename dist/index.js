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
const User_1 = require("./entities/User");
const passport_github_1 = require("passport-github");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(express_1.default.json());
    passport_1.default.use(new passport_github_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
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
        res.redirect(`http://localhost:54321/auth/${req.user.accessToken}`);
    });
    app.get("/", (_req, res) => {
        res.send("it's working!");
    });
    app.listen(3000);
}))();
//# sourceMappingURL=index.js.map