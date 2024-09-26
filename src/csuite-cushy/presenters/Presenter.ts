// see `src/csuite/form/presenters/presenter.readme.md`

import type { Field } from '../../csuite/model/Field'
import type { PresenterRule, PresenterSlots } from './PresenterSlots'

import { createElement, type ReactNode } from 'react'

import { mergeDefined } from '../../csuite/utils/mergeDefined'
import { defaultPresenterRule, defaultPresenterSlots } from './PresenterSlots'

/**
 * retrieve * Shell + Slots for each field,
 * and convenient method to call the Wrapper bound to field and slots
 */
export class Presenter {
    rules: PresenterRule<Field>[]

    constructor(
        /** rules are functions that may alter slots for current fields */
        rules: PresenterRule<Field>[],

        /** if parent is given, it's rules will be re-used as fallback */
        parent?: Presenter,
    ) {
        this.rules = parent ? [...parent.rules, ...rules] : rules
    }

    /** create a new Presenter from this one with extra rendering rules */
    extend(rule_: PresenterRule<Field> | PresenterRule<Field>[]): Presenter {
        const rules = Array.isArray(rule_) ? rule_ : [rule_]
        return new Presenter(rules, this)
    }

    /**
     * this method is both for humans (calling render on field root)
     * and for fields rendering their childern
     */
    render<FIELD extends Field>(
        //
        field: FIELD,
        extraRules_: PresenterRule<FIELD> | PresenterRule<FIELD>[],
    ): ReactNode {
        // slots accumulator
        let slots: PresenterSlots = defaultPresenterRule(field)

        // apply all rules from context
        for (const rule of this.rules) {
            const slots_ = rule(field)
            if (slots_) slots = mergeDefined(slots, slots_)
        }

        // apply all rules specific to this field
        const extraRules = Array.isArray(extraRules_) ? extraRules_ : [extraRules_]
        for (const rule of extraRules) {
            const slots_ = rule(field)
            if (slots_) slots = mergeDefined(slots, slots_)
        }

        const Shell = slots.Shell ?? defaultPresenterSlots.Shell
        if (!Shell) throw new Error('Shell is not defined')

        return createElement(Shell, { field, ...slots })
    }
}
