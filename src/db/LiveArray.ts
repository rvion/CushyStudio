// import * as mobx from 'mobx'
// import { YArray, YArrayEvent, YMap, YMapEvent } from 'yjs/dist/src/internals'
// import { LiveInstance } from './LiveInstance'
// import { LiveDB } from './LiveDB'
// import { MERGE_PROTOTYPES } from './LiveHelpers'

// export interface LiveEntityClass<T extends { id: string }, L> {
//     new (...args: any[]): LiveInstance<T, L> & L // & InitEntity<L>
// }

// export class LiveArray<
//     //
//     T extends { id: string },
//     L extends LiveInstance<T, L>,
// > {
//     yjsArr: YArray<T>
//     mobxArr: L[] = []

//     constructor(
//         //
//         public db: LiveDB,
//         public name: string,
//         public InstanceClass: LiveEntityClass<T, L>,
//     ) {
//         mobx.makeObservable(this, { mobxArr: mobx.observable })
//         this.yjsArr = this.db.doc.getArray(name)
//         this.yjsArr.observe(this.onYjsArrEvent)
//     }

//     clear = () => {
//         return this.yjsArr.delete(0, this.yjsArr.length)
//     }
//     map = <X>(fn: (k: string, l: L) => X): X[] => {
//         return this.mobxArr.map((v,k) => fn(k, v))
//     }
//     mapData = <X>(fn: (k: string, t: T) => X): X[] => {
//         return Array.from(this.mobxArr.entries()).map(([k, v]) => fn(k, v.data))
//     }
//     get = (id: string) => {
//         return this.mobxArr.get(id)
//     }
//     getOrThrow = (id: string) => {
//         const val = this.mobxArr.get(id)
//         if (val == null) throw new Error(`ERR: ${this.name}(${id}) not found`)
//         return val
//     }
//     getOrCreate = (id: string, def: () => T): L => {
//         const val = this.mobxArr.get(id)
//         if (val == null) return this.create(def())
//         return val
//     }
//     private _createInstance = (data: T): L => {
//         const instance = new this.Ktor()
//         instance.init(this, data)
//         return instance
//     }
//     create = (data: T): L => {
//         const id = data.id
//         this.yjsMap.set(id, data)
//         const instance = this._createInstance(data)
//         this.mobxArr.set(id, instance)
//         return instance
//     }
//     toJSON = () => {
//         return Object.fromEntries(this.mobxArr.entries())
//     }

//     onYjsArrEvent = (yArrEvent: YArrayEvent<T>) => {
//         const yarr = this.yjsArr
//         console.log(`🔴🔴`, yArrEvent)
//         mobx.runInAction(() => {
//             yArrEvent.changes.keys.forEach((change, key) => {
//                 console.log(`🔴`, change, key)
//                 // if (change.action === 'add') {
//                 //     console.log(`Property "${key}" was added. Initial value: "${ymap.get(key)}".`)
//                 //     const data = yarr.get(key)
//                 //     if (data == null) throw new Error('ERR1: value is null')
//                 //     const instance = this._createInstance(data)
//                 //     this.mobxArr.set(key, instance)
//                 // } else if (change.action === 'update') {
//                 //     const prev = this.mobxArr.get(key)
//                 //     if (prev == null) throw new Error('ERR2: prev is null')
//                 //     const value = yarr.get(key)
//                 //     if (value == null) throw new Error('ERR3: value is null')
//                 //     prev.data = value
//                 // } else if (change.action === 'delete') {
//                 //     this.mobxArr.delete(key)
//                 // }
//             })
//         })
//     }
// }
