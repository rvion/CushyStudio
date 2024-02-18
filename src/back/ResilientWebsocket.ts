// import type { MessageEvent, EventListenerOptions, CloseEvent } from 'ws'

import { makeAutoObservable, reaction } from 'mobx'

type Message = string | Buffer

export class ResilientWebSocketClient {
    // private protocols?: string | string[]
    private url: string
    private currentWS?: Maybe<WebSocket>
    private messageBuffer: Message[] = []

    isOpen = false

    debugMessages: { type: 'info' | 'error'; timestamp: number; message: string }[] = []

    addInfo = (msg: string) => {
        this.debugMessages.push({ type: 'info', timestamp: Date.now(), message: msg })
        console.info('[🧦] WS:', msg)
    }

    addError = (err: string) => {
        this.debugMessages.push({ type: 'error', timestamp: Date.now(), message: err })
        console.error('[🧦] WS:', err)
    }

    constructor(
        public options: {
            url: () => string /*protocols?: string | string[]*/
            onMessage: (event: MessageEvent) => void
            onConnectOrReconnect: () => void
            onClose: () => void
        },
    ) {
        this.url = options.url()
        makeAutoObservable(this)
        reaction(options.url, (url: string) => this.updateURL(url), { fireImmediately: true })
        // this.protocols = options.protocols
    }

    reconnectTimeout?: Maybe<NodeJS.Timeout>

    updateURL = (url: string): void => {
        this.url = url
        this.connect()
    }

    connect = (): void => {
        this.isOpen = false
        const prevWS = this.currentWS

        // cleanup a possible re-connection timeout for an other url
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)

        this.currentWS = null
        if (prevWS) {
            this.addInfo('Previous WebSocket discarded')
            prevWS.close()
        }
        const ws = new WebSocket(this.url)
        ws.binaryType = 'arraybuffer'

        this.currentWS = ws

        if (this.options.onMessage) {
            ws.onmessage = (event: MessageEvent) => {
                this.options.onMessage(event)
            }
        }

        ws.onopen = (event: Event) => {
            if (ws !== this.currentWS) return
            this.addInfo('✅ WebSocket connected to ' + this.url)
            this.isOpen = true
            this.options.onConnectOrReconnect()
            this.flushMessageBuffer()
        }

        ws.onclose = (event: CloseEvent) => {
            if (ws !== this.currentWS) return
            this.addError(`WebSocket closed (reason=${JSON.stringify(event.reason)}, code=${event.code})`)
            this.isOpen = false
            this.addInfo('⏱️ reconnecting in 2 seconds...')
            this.reconnectTimeout = setTimeout(() => this.connect(), 2000) // Attempt to reconnect after 5 seconds
        }

        ws.onerror = (event: Event) => {
            if (ws !== this.currentWS) return
            this.addError(`WebSocket ERROR` + JSON.stringify(event))
            console.error({ event })
        }
    }

    public send(message: Message): void {
        if (this.isOpen) {
            this.currentWS?.send(message)
        } else {
            this.messageBuffer.push(message)
        }
    }

    private flushMessageBuffer(): void {
        while (this.messageBuffer.length > 0) {
            const message = this.messageBuffer.shift()!
            this.currentWS?.send(message)
        }
    }

    public addEventListener<K extends keyof WebSocketEventMap>(
        type: K,
        listener: (ev: WebSocketEventMap[K]) => any,
        options?: EventListenerOptions,
    ): void {
        this.currentWS?.addEventListener(type as any, listener as any, options)
    }

    public removeEventListener<K extends keyof WebSocketEventMap>(
        type: K,
        listener: (ev: WebSocketEventMap[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void {
        this.currentWS?.removeEventListener(type as any, listener as any)
    }
}

type WebSocketEventMap = {
    open: Event
    close: CloseEvent
    error: Event
    message: MessageEvent
}
