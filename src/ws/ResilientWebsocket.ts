import type { Maybe } from '../core/ComfyUtils'

import { makeAutoObservable, reaction } from 'mobx'
import { logger } from '../logger/Logger'
import { WebSocket, CloseEvent, Event, MessageEvent, EventListenerOptions } from 'ws'

type Message = string | Buffer
// | DataView
// | number
// | ArrayBufferView
// | Uint8Array
// | ArrayBuffer
// | SharedArrayBuffer
// | ReadonlyArray<any>
// | ReadonlyArray<number>

export class ResilientWebSocketClient {
    private url: string
    // private protocols?: string | string[]
    private currentWS?: Maybe<WebSocket>
    private messageBuffer: Message[] = []
    isOpen = false

    constructor(
        public options: {
            //
            url: () => string /*protocols?: string | string[]*/
            onMessage: (event: MessageEvent) => void
        },
    ) {
        this.url = options.url()
        makeAutoObservable(this)
        reaction(options.url, (url: string) => this.updateURL(url), { fireImmediately: true })
        // this.protocols = options.protocols
    }

    reconnectTimeout?: Maybe<NodeJS.Timeout>

    public updateURL(url: string): void {
        this.url = url
        this.connect()
    }

    get emoji() {
        if (this.isOpen) return '🟢'
        return '🔴'
        // return '❓'
    }

    public connect(): void {
        this.isOpen = false
        const prevWS = this.currentWS

        // cleanup a possible re-connection timeout for an other url
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout)

        this.currentWS = null
        if (prevWS) {
            logger.debug('🧦', 'Previous WebSocket discarded')
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
            logger.info('🧦', '🟢 WebSocket connected')
            this.isOpen = true
            this.flushMessageBuffer()
        }

        ws.onclose = (event: CloseEvent) => {
            if (ws !== this.currentWS) return
            logger.error('🧦', `WebSocket closed (reason=${JSON.stringify(event.reason)}, code=${event.code})`)
            this.isOpen = false
            logger.info('🧦', '⏱️ reconnecting in 2 seconds...')
            this.reconnectTimeout = setTimeout(() => this.connect(), 2000) // Attempt to reconnect after 5 seconds
        }

        ws.onerror = (event: Event) => {
            if (ws !== this.currentWS) return
            logger.error('🧦', `WebSocket ERROR`)
            console.error('WebSocket error:', event)
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
