import { MessageDocument } from '../../entity/Message';

export class Conversation {
    private _room: string;

    private _latestMessage: MessageDocument;

    private _numberOfUnread: number;

    get room(): string {
      return this._room;
    }

    set room(value: string) {
      this._room = value;
    }

    get latestMessage(): MessageDocument {
      return this._latestMessage;
    }

    set latestMessage(value: MessageDocument) {
      this._latestMessage = value;
    }

    get numberOfUnread(): number {
      return this._numberOfUnread;
    }

    set numberOfUnread(value: number) {
      this._numberOfUnread = value;
    }
}
