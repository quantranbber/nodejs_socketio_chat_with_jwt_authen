import mongoose, { ConnectionOptions } from 'mongoose';

(<any>mongoose).Promise = global.Promise;

interface IOnConnectedCallback {
  (): void;
}

export default class MongoConnection {
  private readonly mongoUrl: string;

  private onConnectedCallback: IOnConnectedCallback;

  private isConnectedBefore: boolean = false;

  private readonly mongoConnectionOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };

  constructor(mongoUrl: string) {
    this.mongoUrl = mongoUrl;
    mongoose.connection.on('error', this.onError);
    mongoose.connection.on('disconnected', this.onDisconnected);
    mongoose.connection.on('connected', this.onConnected);
    mongoose.connection.on('reconnected', this.onReconnected);
  }

  public close(onClosed: (err: any) => void) {
    console.log('Closing the MongoDB connection');
    mongoose.connection.close(onClosed);
  }

  public connect(onConnectedCallback: IOnConnectedCallback) {
    this.onConnectedCallback = onConnectedCallback;
    this.startConnection();
  }

  public startConnection = () => {
    console.log('Connecting to MongoDB');
    try {
      mongoose.connect(this.mongoUrl, this.mongoConnectionOptions).catch(() => { });
    } catch (err) {
      console.log(err);
    }
  }

  private onConnected = () => {
    console.log('[SUCCESS] Connected to MongoDB success');
    this.isConnectedBefore = true;
    this.onConnectedCallback();
  };

  private onReconnected = () => {
    console.log('Reconnected to MongoDB');
    this.onConnectedCallback();
  };

  private onError = () => {
    console.log('Could not connect to mongo');
    process.exit(1);
  };

  private onDisconnected = () => {
    if (!this.isConnectedBefore) {
      setTimeout(() => {
        this.startConnection();
      }, 2000);
      console.log('Retrying mongo connection');
    }
  };
}
