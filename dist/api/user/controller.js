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
exports.login = exports.create = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const service_1 = __importDefault(require("./service"));
const secret = process.env.JWT_KEY;
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const salt = bcrypt_1.genSaltSync(10);
    body.password = bcrypt_1.hashSync(body.password, salt);
    try {
        res.send(yield service_1.default.create(body));
    }
    catch (err) {
        next(err);
    }
});
exports.create = create;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = yield service_1.default.getUserByUsername(body.username);
    const result = bcrypt_1.compareSync(body.password, user.password);
    if (result) {
        user.password = undefined;
        const jsontoken = jsonwebtoken_1.sign({ result: user }, secret, {
            expiresIn: '1h'
        });
        res.send({
            success: 1,
            message: 'login successfully',
            token: jsontoken
        });
    }
    else {
        res.send({
            success: 0,
            data: 'Invalid email or password'
        });
    }
});
exports.login = login;
exports.default = { create: exports.create, login: exports.login };
//# sourceMappingURL=controller.js.map