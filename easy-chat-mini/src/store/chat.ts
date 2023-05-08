import type { MessageEntity } from './message-entity'
export class Chat {
    messages : MessageEntity[];
    chatId : string;
    constructor(messages : MessageEntity[]) {
        this.messages = messages;
        this.chatId = "1";
    }
}