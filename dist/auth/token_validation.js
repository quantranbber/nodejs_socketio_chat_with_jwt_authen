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
exports.checkToken = void 0;
const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.get('authorization');
    if (token) {
        token = token.slice(7);
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                return res.send({
                    success: 0,
                    message: 'Invalid Token...'
                });
            }
            req.decoded = decoded;
            next();
        });
    }
    else {
        return res.send({
            success: 0,
            message: 'Access Denied! Unauthorized User'
        });
    }
});
exports.checkToken = checkToken;
exports.default = { checkToken: exports.checkToken };
//# sourceMappingURL=token_validation.js.map