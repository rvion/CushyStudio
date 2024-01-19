// 🟢 2024-01-19: convert to V2

import type { Widget } from 'src/controls/Widget'

import { observer } from 'mobx-react-lite'
import { SelectUI } from 'src/rsuite/SelectUI'
import { WidgetWithLabelUI } from '../shared/WidgetWithLabelUI'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { ComfySchemaL } from 'src/models/Schema'
import { runWithGlobalForm } from 'src/models/_ctx2'
import { FormBuilder } from '../FormBuilder'
import {
    WidgetConfigFields,
    WidgetStateFields,
    GetWidgetResult,
    WidgetTypeHelpers,
    IWidget,
    WidgetTypeHelpers2,
    IWidget2,
} from '../IWidget'
import { toastError } from 'src/utils/misc/toasts'

type __ChoiceDef = { [key: string]: () => Widget }

// CONFIG
export type Widget_choices_config<T extends __ChoiceDef> = WidgetConfigFields<{
    items: T
    defaultActiveBranches?: { [k in keyof T]?: boolean }
    placeholder?: string
}>

// SERIAL
export type Widget_choices_serial<T extends __ChoiceDef> = WidgetStateFields<{
    type: 'choices'
    active: true
    branches: { [k in keyof T]?: boolean }
    values_: { [k in keyof T]?: ReturnType<T[k]>['$Serial'] }
}>

// OUT
export type Widget_choices_output<T extends __ChoiceDef> = {
    [k in keyof T]?: GetWidgetResult<ReturnType<T[k]>>
}

// TYPES
export type Widget_choices_types<T extends __ChoiceDef> = {
    $Type: 'choices'
    $Input: Widget_choices_config<T>
    $Serial: Widget_choices_serial<T>
    $Output: Widget_choices_output<T>
}

export interface Widget_choices<T extends __ChoiceDef> extends WidgetTypeHelpers2<Widget_choices_types<T>> {}
export class Widget_choices<T extends __ChoiceDef> implements IWidget2<Widget_choices_types<T>> {
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly isOptional = false
    readonly id: string
    readonly type: 'choices' = 'choices'

    children: { [k in keyof T]?: ReturnType<T[k]> } = {}
    serial: Widget_choices_serial<T>

    constructor(
        public readonly builder: FormBuilder,
        public readonly schema: ComfySchemaL,
        public readonly config: Widget_choices_config<T>,
        serial?: Widget_choices_serial<T>,
    ) {
        // ensure ID
        this.id = serial?.id ?? nanoid()

        // basic sanity check because of the recent breaking change
        if (typeof config.items === 'function') {
            toastError('🔴 ChoicesWidget "items" property should now be an object, not a function')
            debugger
        }

        // ensure serial present and valid
        if (serial) {
            this.serial = serial
        } else {
            this.serial = {
                type: 'choices',
                id: this.id,
                active: true,
                values_: {},
                branches: {},
            }
        }

        // find all active branches
        const activeBranches: (keyof T)[] = []
        runWithGlobalForm(this.builder, () => {
            for (const [branch, isBranchActive] of Object.entries(this.config.defaultActiveBranches ?? {})) {
                if (isBranchActive) this.enableBranch(branch)
            }
        })

        makeAutoObservable(this)
    }

    toggleBranch(branch: keyof T & string) {
        if (this.children[branch]) this.disableBranch(branch)
        else this.enableBranch(branch)
    }

    disableBranch(branch: keyof T & string) {
        if (!this.children[branch]) throw new Error(`❌ Branch "${branch}" not enabled`)
        delete this.children[branch]
        // delete this.serial.values_[branch] // <- WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
        delete this.serial.branches[branch]
    }

    enableBranch(branch: keyof T & string) {
        if (this.children[branch]) throw new Error(`❌ Branch "${branch}" already enabled`)
        // first: quick safety net to check against schema changes
        // a. re-create an empty item to check it's schema
        const fn = this.config.items[branch]
        if (fn == null) throw new Error(`❌ Branch "${branch}" has no initializer function`)

        const newItem = fn()
        const prevBranchSerial = this.serial.values_?.[branch]
        const newType = newItem.type

        // prev serial seems compmatible => we use it
        if (prevBranchSerial && newType === prevBranchSerial.type) {
            const newInput = newItem.config
            this.children[branch] = this.builder._HYDRATE(newType, newInput, prevBranchSerial)
        }
        // prev serial is not compatible => we use the fresh one instead
        else {
            this.serial.values_[branch] = newItem.serial
            this.children[branch] = newItem as any
        }

        // set the active branch as active
        this.serial.branches[branch] = true
    }

    /** results, but only for active branches */
    get result(): Widget_choices_output<T> {
        const out: { [key: string]: any } = {}
        for (const branch in this.children) {
            // if (this.state.branches[key] !== true) continue
            out[branch] = this.children[branch]!.result
        }
        return out as any
    }
}

export const WidgetChoicesUI = observer(function WidgetChoicesUI_(p: {
    widget: Widget_choices<{ [key: string]: () => Widget }>
}) {
    const widget = p.widget

    type Entry = { key: string; value?: Maybe<boolean> }

    // choices
    const choicesStr: string[] = Object.keys(widget.config.items)
    const choices: Entry[] = choicesStr.map((v) => ({ key: v }))

    // values
    const activeSubwidgets = Object.entries(widget.children) //
        .map(([branch, subWidget]) => ({ branch, subWidget }))

    return (
        <div className='_WidgetChoicesUI' tw='relative'>
            <div tw='flex items-start w-full'>
                <SelectUI<Entry>
                    tw='flex-grow'
                    placeholder={p.widget.config.placeholder}
                    value={() =>
                        Object.entries(widget.serial.branches)
                            .map(([key, value]) => ({ key, value }))
                            .filter((x) => x.value)
                    }
                    options={() => choices}
                    getLabelText={(v) => v.key}
                    getLabelUI={(v) => (
                        <div tw='flex flex-1 justify-between'>
                            {/*  */}
                            <div tw='flex-1'>{v.key}</div>
                            <div
                                tw='btn btn-square btn-sm'
                                onClick={(ev) => {
                                    ev.preventDefault()
                                    ev.stopPropagation()
                                    console.log(`[👙] ok`, 1)
                                }}
                            >
                                <span className='material-symbols-outlined'>delete</span>
                            </div>
                        </div>
                    )}
                    equalityCheck={(a, b) => a.key === b.key}
                    multiple
                    closeOnPick={false}
                    resetQueryOnPick={false}
                    onChange={(v) => {
                        widget.toggleBranch(v.key)
                        // const prev = Boolean(widget.serial.branches[v.key])
                        // widget.serial.branches[v.key] = !prev
                    }}
                />
            </div>
            <div tw={[widget.config.layout === 'H' ? 'flex' : null]} className={widget.config.className}>
                {activeSubwidgets.map((val) => {
                    const subWidget = val.subWidget
                    if (subWidget == null) return <>❌ error</>
                    return (
                        <WidgetWithLabelUI //
                            key={val.branch}
                            rootKey={val.branch}
                            widget={subWidget}
                        />
                    )
                })}
            </div>
        </div>
    )
})
