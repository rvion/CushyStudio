import * as mobx from 'mobx'
import { YMap, YMapEvent } from 'yjs/dist/src/internals'
import { LiveInstance } from './LiveInstance'
import { LiveDB } from './LiveDB'
import { MERGE_PROTOTYPES } from './LiveHelpers'

export interface LiveEntityClass<T extends { id: string }, L> {
    new (...args: any[]): LiveInstance<T, L> & L // & InitEntity<L>
}

export class LiveTable<
    //
    T extends { id: string },
    L extends LiveInstance<T, L>,
> {
    yjsMap: YMap<T>
    mobxMap = new Map<string, L>()
    Ktor: LiveEntityClass<T, L>

    constructor(
        //
        public db: LiveDB,
        public name: string,
        public InstanceClass: LiveEntityClass<T, L>,
    ) {
        mobx.makeObservable(this, { mobxMap: mobx.observable })
        this.yjsMap = this.db.doc.getMap(name)
        this.yjsMap.observe(this.onYjsMapEvent)

        const BaseInstanceClass = class implements LiveInstance<T, T> {
            table!: LiveTable<T, any>
            data!: T
            get id() { return this.data.id } // prettier-ignore
            update(t: Partial<T>) {
                console.log(`not implemented`)
            }
            delete() {
                this.table.yjsMap.delete(this.data.id)
            }
            toJSON() {
                return this.data
            }
            init(table: LiveTable<T, L>, data: T) {
                this.table = table
                this.data = data
                mobx.makeAutoObservable(this)
            }
        }

        MERGE_PROTOTYPES(InstanceClass, BaseInstanceClass)
        this.Ktor = InstanceClass

        // Object.defineProperties(this.ctor)
    }

    clear = () => {
        return this.yjsMap.clear()
    }
    map = <X>(fn: (k: string, l: L) => X): X[] => {
        return Array.from(this.mobxMap.entries()).map(([k, v]) => fn(k, v))
    }
    mapData = <X>(fn: (k: string, t: T) => X): X[] => {
        return Array.from(this.mobxMap.entries()).map(([k, v]) => fn(k, v.data))
    }
    get = (id: string) => {
        return this.mobxMap.get(id)
    }
    getOrThrow = (id: string) => {
        const val = this.mobxMap.get(id)
        if (val == null) throw new Error(`ERR: ${this.name}(${id}) not found`)
        return val
    }
    getOrCreate = (id: string, def: () => T): L => {
        const val = this.mobxMap.get(id)
        if (val == null) return this.create(def())
        return val
    }
    private _createInstance = (data: T): L => {
        const instance = new this.Ktor()
        instance.init(this, data)
        return instance
    }
    create = (data: T): L => {
        const id = data.id
        this.yjsMap.set(id, data)
        const instance = this._createInstance(data)
        this.mobxMap.set(id, instance)
        return instance
    }
    toJSON = () => {
        return Object.fromEntries(this.mobxMap.entries())
    }

    onYjsMapEvent = (ymapEvent: YMapEvent<T>) => {
        const ymap = this.yjsMap
        mobx.runInAction(() => {
            ymapEvent.changes.keys.forEach((change, key) => {
                if (change.action === 'add') {
                    // console.log(`Property "${key}" was added. Initial value: "${ymap.get(key)}".`)
                    const data = ymap.get(key)
                    if (data == null) throw new Error('ERR1: value is null')
                    const instance = this._createInstance(data)
                    this.mobxMap.set(key, instance)
                } else if (change.action === 'update') {
                    const prev = this.mobxMap.get(key)
                    if (prev == null) throw new Error('ERR2: prev is null')
                    const value = ymap.get(key)
                    if (value == null) throw new Error('ERR3: value is null')
                    prev.data = value
                } else if (change.action === 'delete') {
                    this.mobxMap.delete(key)
                }
            })
        })
    }
}
