// see `src/csuite/form/presenters/presenter.readme.md`

import type { Field } from '../../model/Field'
import type { PresenterConfig } from './PresenterConfig'
import type { PresenterSlots } from './PresenterSlots'

import { createElement, type ReactNode } from 'react'

import { defaultPresenterSlots } from './PresenterSlotsDefaults'

/**
 * retrieve * Shell + Slots for each field,
 * and convenient method to call the Wrapper bound to field and slots
 */
export class Presenter {
    constructor(
        //
        public config: PresenterConfig,
        parent?: Presenter,
    ) {}

    extend(config: PresenterConfig): Presenter {
        return new Presenter((field) => {
            const x = config(field)
            if (x !== undefined) return x
            return this.renderFn(field)
        })
    }

    /**
     * this method is both for humans (calling render on field root)
     * and for fields rendering their childern
     */
    render(field: Field, slotsOverride: PresenterSlots): ReactNode {
        const Shell = this.config.shell(field) ?? DefaultShell
        const slotsBase = defaultPresenterSlots
        const slotsConfig = this.config.slots(field)
        const slots = {
            ...slotsBase,
            ...slotsConfig,
            ...slotsOverride,
        }
        return createElement(Shell, { field, ...slots })
        // return this.renderFn(field)
    }
}

const DefaultShell = () => {
    return createElement('div', null, '❌ Default Shell ❌')
}
