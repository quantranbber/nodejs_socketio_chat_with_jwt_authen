"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = __importDefault(require("./router"));
const app = express_1.default();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});
const http = new http_1.default.Server(app);
const io = socket_io_1.default(http);
const parser = body_parser_1.default;
const cookieParser = cookie_parser_1.default;
require('dotenv').config({ path: './process.env' });
app.use(cookieParser());
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use('/', router_1.default);
require('./service/socket')(io);
exports.default = app;
//# sourceMappingURL=app.js.map