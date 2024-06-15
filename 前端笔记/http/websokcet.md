```
const EventType = ['open', 'message', 'close', 'error']

class Dep {
    deps = new Map()
    depend(name, cb) {
        EventType.includes(name) && this.deps.set(name, cb)
    }
    notify(name, evt) {
        EventType.includes(name) && this.deps.get(name)(evt)
    }
}

// 消息类型
const MsgType = {
    MSG: 'message', // 普通消息
    HEART_BEAT: 'heart_beat'  // 心跳
}

class Socket {
    sokcet
    config
    // 记录断线重连的时间器
    reconnectTimer
    // 记录心跳时间器
    heartBeatTimer
    // 记录socket连接状态
    webSocketState
    Dep = new Dep()

    constructor(config) {
        this.config = Object.assign(this.defaultConfig, config)
    }

    init() {
        this.sokcet = new WebSocket(this.config.url)
        this.sokcet.onopen = this.openHandler // 连接成功后的回调函数
        this.sokcet.onclose = this.closeHandler // 连接关闭后的回调 函数
        this.sokcet.onmessage = this.messageHandler // 收到服务器数据后的回调函数
        this.sokcet.onerror = this.errorHandler // 连接发生错误的回调方法
    }

    // 默认配置
    get defaultConfig() {
        return {
            url: '',
            // 心跳时间间隔
            heartBeatTime: 1000,
            // 心跳超时间隔
            heartBeatTimeout: 3000,
            // 断线重连时间间隔
            heartBeatReconnect: 1000,
            // 是否断线重连
            isReconnect: true,
        }
    }

    // 获取消息
    getMessage({ data }) {
        return JSON.parse(data)
    }

    // 发送消息
    sendMessage(data) {
        return this.sokcet.send(JSON.stringify(data))
    }

    // 连接成功后的回调函数
    openHandler(e) {
        this.Dep.notify('open', e)
        // socket状态设置为连接，做为后面的断线重连的拦截器
        this.webSocketState = true
        // 判断是否启动心跳机制
        this.startHeartBeat()
    }

    errorHandler() {
        this.Dep.notify('error', e)
        // 设置socket状态为断线
        this.webSocketState = false
        // 重新连接
        this.reconnectWebSocket()
    }

    // 收到服务器数据后的回调函数 
    messageHandler(data) {
        const { type, msg } = this.getMessage(data)
        switch (type) {
            case MsgType.MSG: // 普通消息类型
                this.Dep.notify('message', msg)
                break
            case MsgType.HEART_BEAT: // 心跳
                this.webSocketState = true
                break
        }
    }

    // 连接关闭后的回调 函数
    closeHandler(e) {
        // 触发事件更改按钮的状态
        this.Dep.notify('close', e)
        // 设置socket状态为断线
        this.webSocketState = false
        // 在断开连接时 记得要清楚心跳时间器和 断开重连时间器材
        this.heartBeatTimer && clearTimeout(this.heartBeatTimer)
        this.reconnectTimer && clearTimeout(this.reconnectTimer)
        this.reconnectWebSocket()
    }

    // 心跳初始化方法 time：心跳间隔
    startHeartBeat() {
        if (!this.config.heartBeatTime) return
        this.heartBeatTimer = setTimeout(() => {
            // 客户端每隔一段时间向服务端发送一个心跳消息
            this.sendMessage({
                type: MsgType.HEART_BEAT,
                msg: Date.now()
            })
            this.waitingServer()
        }, this.heartBeatConfig.time)
    }

    // 在客户端发送消息之后，延时等待服务器响应,通过webSocketState判断是否连线成功
    waitingServer() {
        this.webSocketState = false
        setTimeout(() => {
            // 连线成功状态下 继续心跳检测
            if (this.webSocketState) {
                this.startHeartBeat()
                return
            }
            console.log('心跳无响应, 已经和服务端断线')
            // 重新连接时，记得要先关闭当前连接
            try {
                this.socket.close()
            } catch (error) {
                console.log('当前连接已经关闭')
            }
            // 重新连接
            this.reconnectWebSocket()
        }, this.config.heartBeatTimeout)
    }

    // 重新连接
    reconnectWebSocket() {
        // 判断是否需要断线重连
        if (!this.isReconnect) return
        // 根据传入的断线重连时间间隔 延时连接
        this.reconnectTimer = setTimeout(() => {
            this.init()
        }, this.config.heartBeatTime)
    }
}
```

