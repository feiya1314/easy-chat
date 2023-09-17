export interface Logger {
    debug(...args : any[]) : void
    info(...args : any[]) : void
    warn(...args : any[]) : void
    error(...args : any[]) : void
    setFilterMsg(msg : string) : void
}

class WxLogger implements Logger {
    log : any
    constructor(log : any) {
        this.log = log;
    }

    debug(...args : any[]) {
        if (!this.log) return
        this.log.debug.apply(this.log, args)
    }
    info(...args : any[]) {
        if (!this.log) return
        this.log.info.apply(this.log, args)
    }
    warn(...args : any[]) {
        if (!this.log) return
        this.log.warn.apply(this.log, args)
    }
    error(...args : any[]) {
        if (!this.log) return
        this.log.error.apply(this.log, args)
    }
    setFilterMsg(msg : string) { // 从基础库2.7.3开始支持
        if (!this.log || !this.log.setFilterMsg) return
        if (typeof msg !== 'string') return
        this.log.setFilterMsg(msg)
    }
}
let wxLog = null;
//#ifdef MP-WEIXIN  
wxLog = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
//#endif  
export const logger : Logger = new WxLogger(wxLog)