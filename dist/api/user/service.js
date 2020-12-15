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
const bcrypt_1 = require("bcrypt");
const User_1 = __importDefault(require("../../entity/User"));
class UserService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = {
                username: data.username,
                avatar: data.avatar || '',
                gender: data.gender
            };
            const salt = bcrypt_1.genSaltSync(10);
            user.password = bcrypt_1.hashSync(data.password, salt);
            const newUser = yield new User_1.default(user);
            yield newUser.save();
            return newUser._id.toString();
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findOne({ username });
        });
    }
    getUserByUserId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.default.findById(id);
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=service.js.map