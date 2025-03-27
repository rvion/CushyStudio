import type { CSchema } from '../csuite'
import type { Field } from '../csuite/model/Field'
import type { Json } from '../csuite/types/Json'
import type { Builder } from '../CUSHY'
import type * as FL from '../flexlayout-react'
import type { CushyLayoutManager } from './Layout'
import type { Panel } from './Panel'
import type { PanelPersistedJSON } from './PanelPersistedJSON'
import type { PanelName } from './PANELS'

import { makeObservable } from 'mobx'
import { useMemo } from 'react'

import { bang } from '../csuite/utils/bang'
import { naiveDeepClone } from '../csuite/utils/naiveDeepClone'
import { useMemoAction } from '../csuite/utils/useMemoAction'
import { PanelPersistentStore } from './PanelPersistentStore'

export type PanelURI = string

export class PanelState<PROPS extends object = any> {
   showHeader: boolean = true

   constructor(
      public flexLayoutTabNode: FL.TabNode | null,
      public uri: PanelURI,
      public def: Panel<PROPS>,
   ) {
      makeObservable(this, { showHeader: true })
   }

   patchAttributes(attributes: {
      // borders
      borderHeight?: number
      borderWidth?: number

      // doc
      altName?: string
      helpText?: string

      // class names
      className?: string
      contentClassName?: string
      tabsetClassName?: string

      // can taht be modified ?
      enableClose?: boolean
      enableDrag?: boolean
      enableFloat?: boolean
      enableRename?: boolean
      enableRenderOnDemand?: boolean
   }): void {
      this.layout.do((a) => a.updateNodeAttributes(this.uri, attributes))
   }

   setTabColor(nextColor?: string): void {
      console.log(`[🤠] COLOR IS SET ${nextColor}`, this.flexLayoutTabNode)
      this.patchAttributes({
         className: nextColor,
         // contentClassName: nextColor + 'B',
         // tabsetClassName: nextColor + 'C',
         // altName: nextColor,
         // helpText: nextColor,
      })
      console.log(`[🤠] COLOR IS SET ${nextColor}`, this.flexLayoutTabNode)
   }

   /** ❌ UNFINISHED */
   setProps(p: any): void {
      throw new Error('❌ setProps not implemented')
   }

   getExtraData(): any {
      if (this.flexLayoutTabNode == null) return Object.freeze({})
      return this.flexLayoutTabNode.getExtraData()
   }

   get layout(): CushyLayoutManager {
      return cushy.layout
   }

   get parentTabset(): FL.TabSetNode | null {
      if (this.flexLayoutTabNode == null) return null
      const parent1 = this.flexLayoutTabNode.getParent()
      if (parent1?.getType() !== 'tabset') throw new Error('❌ tab parent is not a tabset')
      const tabset = parent1 as FL.TabSetNode
      return tabset
   }

   get parentRow(): FL.RowNode | null {
      if (this.parentTabset == null) return null
      const parent2 = this.parentTabset.getParent()
      if (parent2?.getType() !== 'row') throw new Error('❌ tabset parent is not a row')
      const row = parent2 as FL.RowNode
      return row
   }

   /** widen this tab tabset */
   widen(): void {
      if (this.parentTabset) this.layout.widenTabset(this.parentTabset)
   }

   /** widen this tab tabset */
   shrink(): void {
      if (this.parentTabset) this.layout.shrinkTabset(this.parentTabset)
   }

   /** reset tabset size */
   resetSize(): void {
      if (this.parentTabset) this.layout.resetTabsetSize(this.parentTabset)
   }

   get model(): FL.Model {
      return this.layout.model
   }

   clone(partialProps: Partial<PROPS>): void {
      const config = this.getConfig()
      this.layout.open(
         this.panelName,
         { ...this.getProps(), ...partialProps },
         {
            where: 'below',
            $store: naiveDeepClone(config.$store),
            $temp: naiveDeepClone(config.$temp),
         },
      )
   }

   get panelName(): PanelName {
      if (this.flexLayoutTabNode == null) return 'Welcome' // 🔴
      const panelName = this.flexLayoutTabNode.getComponent() as Maybe<PanelName>
      return bang(panelName)
   }

   /**
    * Returns the config attribute that can be used to store node specific data that
    * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
    * than directly, for example:
    * this.state.model.doAction(
    *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
    */
   getConfig(): PanelPersistedJSON<PROPS> {
      if (this.flexLayoutTabNode == null) return Object.freeze({ $props: {} }) as any
      return this.flexLayoutTabNode.getConfig()
   }

   /** get component props */
   getProps(): PROPS {
      return bang(this.getConfig().$props) // (this.getConfig() as any as PROPS)
   }

   stores: Map<string, PanelPersistentStore<any>> = new Map<string, PanelPersistentStore>()

   usePersistentStore = <X extends Json>(key: string, init: () => X): PanelPersistentStore<X> => {
      let store = this.stores.get(key) as Maybe<PanelPersistentStore<X>>
      if (store != null) return store
      store = new PanelPersistentStore<X>(this, key, init)
      this.stores.set(key, store)
      return store
   }

   documents: Map<string, Field> = new Map<string, Field>()

   usePersistentModel = <SCHEMA extends CSchema>(
      //
      uid: string,
      init: ((ui: Builder) => SCHEMA) | SCHEMA,
      opts?: { log?: boolean },
   ): SCHEMA['Ҩfield'] => {
      return useMemoAction(() => {
         let schema: SCHEMA = typeof init === 'function' ? init(cushy.forms.builder) : init
         const log = opts?.log ? logForPersistentModel : logVoid
         log(`usePersistentModel (${uid})`)

         const prevEntity = this.documents.get(uid)
         if (prevEntity != null) {
            const prevHash = prevEntity.ϟschema.codeForTypescriptValue()
            const nextHash = schema.codeForTypescriptValue()
            if (prevHash === nextHash) {
               log(`    | 🟢 prev entity found; schema is identical`)
               return prevEntity
            } else {
               log(`    | prev entity found; schema is different`)
               log(`    | prev entity schema`, prevHash)
               log(`    | next entity schema`, nextHash)
            }
         } else {
            log(`    | prev entity not found; creating new one`)
         }

         // get or create panel store to hold/persist the entity
         const storeName = `entity-${uid}`
         let store: PanelPersistentStore<any> = this.stores.get(storeName) as PanelPersistentStore<
            SCHEMA['Ҩserial'] | false
         >
         if (store == null) {
            log(`    | creating store (${storeName})`)
            store = new PanelPersistentStore(this, uid, () => false as false)
            this.stores.set(storeName, store)
         }

         // clone the schema to inject a callback to persist the entity via the panel store
         schema = schema.withConfig({
            onSerialChange: (self) => {
               store.saveData(self.ϟserial)
            },
         })

         const prevSerial = store.data
         const entity = schema.create(prevSerial)
         this.documents.set(uid, entity)
         log(`    | ENTITY for (${uid}) ID IS`, entity.ϟuid, `from store ${store.uid}`)
         return entity
      }, [uid])
   }
}

const logVoid = (...args: any): void => {}
const logForPersistentModel = (...args: any): void => console.log('[🤦‍♀️]', ...args)
