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
exports.findRoomByUserIds = exports.RoomDocument = void 0;
const mongoose_1 = require("mongoose");
class RoomDocument extends mongoose_1.Document {
}
exports.RoomDocument = RoomDocument;
const schema = new mongoose_1.Schema({
    requester: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    accepter: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' }
});
const Room = mongoose_1.model('Room', schema);
const findRoomByUserIds = (userId1, userId2) => __awaiter(void 0, void 0, void 0, function* () {
    return Room.findOne({
        $or: [
            {
                requester: userId1,
                accepter: userId2
            }, {
                requester: userId1,
                accepter: userId2
            }
        ]
    });
});
exports.findRoomByUserIds = findRoomByUserIds;
exports.default = Room;
//# sourceMappingURL=Room.js.map