import type { WidgetDict } from 'src/cards/App'
import type { ComfySchemaL } from 'src/models/Schema'
import type { Widget_group } from './widgets/group/WidgetGroup'

import { __FAIL, __OK, type Result } from 'src/types/Either'
import { FormBuilder } from './FormBuilder'
import { isObservable, runInAction } from 'mobx'

export class Form<
    //
    FIELDS extends WidgetDict,
> {
    form: Result<Widget_group<any>> = __FAIL('not loaded yet')
    constructor(
        //
        public uiFn: (form: FormBuilder) => FIELDS,
        public formSerial: string,
        public ctx: ComfySchemaL,
    ) {
        if (!isObservable(formSerial)) throw new Error('Form serial must be observable')
        runInAction(() => {
            const formBuilder = new FormBuilder(ctx)
            const rootWidget: Widget_group<any> = formBuilder._HYDRATE(
                'group',
                { topLevel: true, items: () => uiFn?.(formBuilder) ?? {} },
                this.formSerial,
            )
            /** 👇 HACK; see the comment near the ROOT property definition */
            formBuilder._ROOT = rootWidget
            this.form = __OK(rootWidget)
        })
    }
}
