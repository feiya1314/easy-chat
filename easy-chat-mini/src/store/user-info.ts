export class User {
    id : string;
    avatar : string;
    nickname : string;

    constructor(id : string, avatar : string, nickname : string) {
        this.id = id;
        this.avatar = avatar;
        this.nickname = nickname;
    }
}