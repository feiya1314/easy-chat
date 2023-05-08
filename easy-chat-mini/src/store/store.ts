// store.js
import { reactive } from 'vue'
import type { MessageEntity } from './message-entity'
import { Chat } from './chat'
import { User } from './user-info'

function loadHistory() : Chat[] {
    console.log("load history")
    var history : Chat[] = new Array();
    return history;
}

var historyInCache : Chat[] = loadHistory();
var curChat : Chat = new Chat(new Array());
var curUser : User = new User("user1", "/static/mine-sel.png", "test1")
var chatAI : User = new User("ai", "/static/logo.png", "ai")

export const store = {
    state: reactive({
        history: historyInCache,
        curChat: curChat,
        curUser: curUser,
        chatAI: chatAI,
    }),
    appendHistory(messages : MessageEntity[]) {
        console.log("append history")
        let chat = new Chat(messages)
        this.state.history.push(chat)
    },
    saveCurChat(message : MessageEntity) {
        console.log("save cur msg")
        this.state.curChat.messages.push(message)
    },
}