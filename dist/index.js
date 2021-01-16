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
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const path_1 = require("path");
const cors_1 = __importDefault(require("cors"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield typeorm_1.createConnection({
        type: 'postgres',
        url: process.env.CON_STRING,
        entities: [path_1.join(__dirname, './entities/*.*')],
        logging: !constants_1.__prod__,
        synchronize: !constants_1.__prod__
    });
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(express_1.default.json());
    app.get("/", (_req, res) => {
        res.send("it's working!");
    });
    app.listen(3000);
}))();
//# sourceMappingURL=index.js.map