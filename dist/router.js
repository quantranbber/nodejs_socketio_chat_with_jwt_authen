"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./api/user/controller"));
const router = express_1.Router();
router.get('/', (req, res) => {
    if (req.cookies['jwt-token'] !== undefined) {
        res.redirect('/home');
    }
    else {
        res.redirect('/login');
    }
});
router.get('/home', (req, res) => {
    if (req.cookies['jwt-token'] !== undefined) {
        res.sendFile(`${__dirname}/template/html/index.html`);
    }
    else {
        res.redirect('/login');
    }
});
router.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/template/html/login.html`);
});
router.get('/register', (req, res) => {
    res.sendFile(`${__dirname}/template/html/register.html`);
});
router.post('/user', controller_1.default.create);
router.post('/login', controller_1.default.login);
exports.default = router;
//# sourceMappingURL=router.js.map