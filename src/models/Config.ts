import type { Tagged } from 'src/utils/types'
import type { LiveInstance } from '../db/LiveInstance'

// export type ConfigID = Tagged<string, 'ConfigID'>
// export const asConfigUID = (s: string): ConfigID => s as any

export type ConfigT = {
    id: 'main-config'
    serverHostHTTP?: string
    serverWsEndpoint?: string
}

export interface ConfigL extends LiveInstance<ConfigT, ConfigL> {}
export class ConfigL {
    get serverHostHTTP() {
        return this.data.serverHostHTTP ?? 'http://192.168.1.19:8188'
    }
    get serverWsEndpoint() {
        return this.data.serverWsEndpoint ?? 'ws://192.168.1.19:8188/ws'
    }
}
