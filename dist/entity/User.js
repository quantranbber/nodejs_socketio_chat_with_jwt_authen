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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.UserDocument = void 0;
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
class UserDocument extends mongoose_1.Document {
}
exports.UserDocument = UserDocument;
const schema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String },
    avatar: { type: String },
    gender: { type: constants_1.UserGender }
});
const User = mongoose_1.model('User', schema);
const updateUser = (userId, user) => __awaiter(void 0, void 0, void 0, function* () {
    return User.findOneAndUpdate({
        _id: userId
    }, {
        $set: {
            username: user.username, avatar: user.avatar
        }
    }, {
        new: true
    });
});
exports.updateUser = updateUser;
exports.default = User;
//# sourceMappingURL=User.js.map