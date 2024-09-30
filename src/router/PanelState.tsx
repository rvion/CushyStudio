import type { BaseSchema } from '../csuite'
import type { Field } from '../csuite/model/Field'
import type { Json } from '../csuite/types/Json'
import type { Builder } from '../CUSHY'
import type { CushyLayoutManager } from './Layout'
import type { Panel } from './Panel'
import type { PanelPersistedJSON } from './PanelPersistedJSON'
import type { PanelName } from './PANELS'
import type * as FL from 'flexlayout-react'

import { bang } from '../csuite/utils/bang'
import { naiveDeepClone } from '../csuite/utils/naiveDeepClone'
import { PanelPersistentStore } from './PanelPersistentStore'

export type PanelURI = string

export class PanelState<PROPS extends object = any> {
    constructor(
        public flexLayoutTabNode: FL.TabNode,
        public uri: PanelURI,
        public def: Panel<PROPS>,
    ) {}

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
        return this.flexLayoutTabNode.getExtraData()
    }

    get layout(): CushyLayoutManager {
        return cushy.layout
    }

    get parentTabset(): FL.TabSetNode {
        const parent1 = this.flexLayoutTabNode.getParent()
        if (parent1?.getType() !== 'tabset') throw new Error('❌ tab parent is not a tabset')
        const tabset = parent1 as FL.TabSetNode
        return tabset
    }

    get parentRow(): FL.RowNode {
        const parent2 = this.parentTabset.getParent()
        if (parent2?.getType() !== 'row') throw new Error('❌ tabset parent is not a row')
        const row = parent2 as FL.RowNode
        return row
    }

    /** widen this tab tabset */
    widen(): void {
        this.layout.widenTabset(this.parentTabset)
    }

    /** widen this tab tabset */
    shrink(): void {
        this.layout.shrinkTabset(this.parentTabset)
    }

    /** reset tabset size */
    resetSize(): void {
        this.layout.resetTabsetSize(this.parentTabset)
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
        return this.flexLayoutTabNode.getConfig()
    }

    /** get component props */
    getProps(): PROPS {
        return bang(this.getConfig().$props) // (this.getConfig() as any as PROPS)
    }

    stores: Map<string, PanelPersistentStore> = new Map<string, PanelPersistentStore>()
    usePersistentStore = <X extends Json>(key: string, init: () => X): PanelPersistentStore<X> => {
        let store = this.stores.get(key) as Maybe<PanelPersistentStore<X>>
        if (store != null) return store
        store = new PanelPersistentStore<X>(this, key, init)
        this.stores.set(key, store)
        return store
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
