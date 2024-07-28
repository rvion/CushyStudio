import type { BaseSchema } from '../csuite'
import type { Field } from '../csuite/model/Field'
import type { Json } from '../csuite/types/Json'
import type { Builder } from '../CUSHY'
import type { CushyLayoutManager } from './Layout'
import type { PanelPersistedJSON } from './PanelPersistedJSON'
import type * as FL from 'flexlayout-react'

import { PanelPersistentStore } from './PanelPersistentStore'

export type PanelID = string
export class PanelState<PROPS extends any = any> {
    constructor(
        public node: FL.TabNode,
        public id: PanelID,
    ) {}

    /** ❌ UNFINISHED */
    setProps(p: any): void {
        throw new Error('❌ setProps not implemented')
    }

    getExtraData(): any {
        return this.node.getExtraData()
    }

    get layout(): CushyLayoutManager {
        return cushy.layout
    }

    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    getConfig(): PanelPersistedJSON<PROPS> {
        return this.node.getConfig()
    }

    /** get component props */
    getProps(): PROPS {
        return (
            this.getConfig().$props ?? //
            (this.getConfig() as any as PROPS)
        )
    }

    stores: Map<string, PanelPersistentStore> = new Map<string, PanelPersistentStore>()
    usePersistentStore = <X extends Json>(key: string, init: () => X): PanelPersistentStore<X> => {
        const prev = this.stores.get(key)
        if (prev != null) return prev as PanelPersistentStore<X>
        const next = new PanelPersistentStore(this, key, init)
        this.stores.set(key, next)
        return next as PanelPersistentStore<X>
    }

    entities: Map<string, Field> = new Map<string, Field>()
    usePersistentModel = <SCHEMA extends BaseSchema>(
        //
        uid: string,
        init: (ui: Builder) => SCHEMA,
    ): SCHEMA['$Field'] => {
        // if previous entity already exists, return it
        const prevEntity = this.entities.get(uid)
        if (prevEntity != null) return prevEntity

        // get or create panel store to hold/persist the entity
        let store = this.stores.get(`entity-${uid}`) as PanelPersistentStore<SCHEMA['$Serial'] | false>
        if (store == null) {
            store = new PanelPersistentStore(this, uid, () => false)
            this.stores.set(`entity-${uid}`, store)
        }

        // clone the schema to inject a callback to persist the entity
        // via the panel store
        const schema = init(cushy.forms.builder).withConfig({
            onSerialChange: (self) => {
                store.saveData(self.serial)
            },
        })

        const prevSerial = store.data
        const entity = schema.create(prevSerial)
        this.entities.set(uid, entity)
        return entity
    }
}
