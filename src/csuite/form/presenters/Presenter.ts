// see `src/csuite/form/presenters/presenter.readme.md`

import type { Field } from '../../model/Field'
import type { PresenterConfig, PresenterFn } from './PresenterConfig'
import type { ReactNode } from 'react'

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

    extend(config: PresenterFn): Presenter {
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
    render(field: Field, slots: {}): ReactNode {
        return this.renderFn(field)
    }
}
