export class MessageEntity {
    from : string;
    createTime : string;
    content : string;
    loading : boolean;
    type : number;

    constructor(from : string, createTime : string, content : string, loading : boolean, type : number) {
        this.from = from;
        this.createTime = createTime;
        this.content = content;
        this.loading = loading;
        this.type = type;
    }
}