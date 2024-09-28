import type { CushySchema } from '../../src/controls/Schema'
import type { Field_choices } from '../../src/csuite/fields/choices/FieldChoices'
import type { Field_group } from '../../src/csuite/fields/group/FieldGroup'
import type { Field_image } from '../../src/csuite/fields/image/FieldImage'
import type { Field_list } from '../../src/csuite/fields/list/FieldList'

type ListItem = X.XGroup<{
    uid: X.XString /* UID */
    value: X.XChoice<{
        image: X.XImage
        latent: X.XGroup<{ size: X.XSize; batch: X.XNumber }>
        process: X.XSelectOne_<string /* UID */> // <---- recursion here
    }>
}>

app({
    ui: (m) => {
        const entry: ListItem = m.fields({
            uid: m.nanoid(),
            value: m.choice({
                image: m.image(),
                latent: m.group({ items: { size: m.size({}), batch: m.int({ default: 1, min: 1, max: 8 }) } }),
                // if choices is a function, the form root is injected as first parameter
                //                           VVVVVVVVVVV
                process: m.selectOneOptionId((self) => {
                    const formRoot = self.root as Field_group<any>

                    // 🔶 null when the form is not yet fully initialized
                    if (formRoot.fields.samplerUI == null) return []

                    // 🔶 self-referencing => typescript can't infer the type here
                    // so to make sure code is correct, we need to cast it to the correct type
                    // (and yes, types are slighly verbose for now)
                    const steps = formRoot.fields.samplerUI as Field_list<
                        CushySchema<
                            Field_choices<{
                                sampler_output_abc_asdf: CushySchema<X.SelectOne_<any>>
                                empty_latent: CushySchema<Field_group<any>>
                                pick_image: CushySchema<Field_image>
                            }>
                        >
                    >

                    // return a list of items
                    const options = steps.items.map((choiceWidget, ix: number) => {
                        // 🔶 probably useless check now
                        if (choiceWidget == null) console.log(`[🔴] err 1: choiceWidget is null`)

                        const _selectOne = choiceWidget.firstActiveBranchField
                        // 🔶 probably useless check now (bis)
                        if (_selectOne == null) console.log(`[🔴] err 2: firstActiveBranchWidget is null`, _selectOne) // prettier-ignore

                        const _actualChoice = _selectOne?.value
                        return {
                            id: _selectOne?.id ?? 'error',
                            disabled: _actualChoice == null,
                            name: _selectOne?.type ?? '❌ ERROR',
                            label: `${ix + 1}th (${choiceWidget.firstActiveBranchName ?? '❓'})`,
                        }
                    })

                    return options
                }),
            }),
        })

        return { samplerUI: entry.list({ defaultLength: 1, min: 1 }) }
    },
    run(run, ui) {
        console.log(`[🟢] done`)
    },
})
