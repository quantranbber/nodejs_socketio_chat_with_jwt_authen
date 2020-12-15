"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const db_1 = __importDefault(require("./db"));
const app_1 = __importDefault(require("./app"));
const result = dotenv_1.default.config();
if (result.error) {
    dotenv_1.default.config({ path: './process.env' });
}
const mongoConnection = new db_1.default(process.env.MONGO_DB_URL);
const port = process.env.PORT;
const http = new http_1.default.Server(app_1.default);
const io = socket_io_1.default(http);
require('./service/socket')(io);
mongoConnection.connect(() => {
    http.listen(port, () => {
        console.log('\x1b[36m%s\x1b[0m', // eslint-disable-line
        `🌏 Express server started at http://localhost:${port}`);
    });
});
//# sourceMappingURL=server.js.map