"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.Promise = global.Promise;
class MongoConnection {
    constructor(mongoUrl) {
        this.isConnectedBefore = false;
        this.mongoConnectionOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        this.startConnection = () => {
            console.log('Connecting to MongoDB');
            try {
                mongoose_1.default.connect(this.mongoUrl, this.mongoConnectionOptions).catch(() => { });
            }
            catch (err) {
                console.log(err);
            }
        };
        this.onConnected = () => {
            console.log('[SUCCESS] Connected to MongoDB success');
            this.isConnectedBefore = true;
            this.onConnectedCallback();
        };
        this.onReconnected = () => {
            console.log('Reconnected to MongoDB');
            this.onConnectedCallback();
        };
        this.onError = () => {
            console.log('Could not connect to mongo');
            process.exit(1);
        };
        this.onDisconnected = () => {
            if (!this.isConnectedBefore) {
                setTimeout(() => {
                    this.startConnection();
                }, 2000);
                console.log('Retrying mongo connection');
            }
        };
        this.mongoUrl = mongoUrl;
        mongoose_1.default.connection.on('error', this.onError);
        mongoose_1.default.connection.on('disconnected', this.onDisconnected);
        mongoose_1.default.connection.on('connected', this.onConnected);
        mongoose_1.default.connection.on('reconnected', this.onReconnected);
    }
    close(onClosed) {
        console.log('Closing the MongoDB connection');
        mongoose_1.default.connection.close(onClosed);
    }
    connect(onConnectedCallback) {
        this.onConnectedCallback = onConnectedCallback;
        this.startConnection();
    }
}
exports.default = MongoConnection;
//# sourceMappingURL=db.js.map