"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require('moment');
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}
exports.default = formatMessage;
//# sourceMappingURL=messages.js.map