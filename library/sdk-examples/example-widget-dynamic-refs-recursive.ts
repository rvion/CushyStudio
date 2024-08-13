import type { Schema } from '../../src/controls/Schema'
import type { Field_choices } from '../../src/csuite/fields/choices/FieldChoices'
import type { Field_group } from '../../src/csuite/fields/group/FieldGroup'
import type { Field_image } from '../../src/csuite/fields/image/FieldImage'
import type { Field_list } from '../../src/csuite/fields/list/FieldList'
import type { Field_selectOne } from '../../src/csuite/fields/selectOne/FieldSelectOne'

app({
    ui: (form) => ({
        samplerUI: form.list({
            label: 'Sampler',
            // showID: true,
            startCollapsed: true,
            defaultLength: 1,
            min: 1,
            element: () =>
                form.choice({
                    items: {
                        sampler_output_abc_asdf: form.selectOne({
                            // showID: true,
                            // if choices is a function, the form root is injected as first parameter
                            choices: (self) => {
                                const formRoot = self.root as Field_group<any>

                                // 🔶 null when the form is not yet fully initialized
                                if (formRoot.fields.samplerUI == null) return []

                                // 🔶 self-referencing => typescript can't infer the type here
                                // so to make sure code is correct, we need to cast it to the correct type
                                // (and yes, types are slighly verbose for now)
                                const steps = formRoot.fields.samplerUI as Field_list<
                                    Schema<
                                        Field_choices<{
                                            sampler_output_abc_asdf: Schema<Field_selectOne<any>>
                                            empty_latent: Schema<Field_group<any>>
                                            pick_image: Schema<Field_image>
                                        }>
                                    >
                                >

                                // return a list of items
                                return steps.items.map((choiceWidget, ix: number) => {
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
                            },
                        }),
                        empty_latent: form.group({
                            layout: 'H',
                            items: {
                                width: form.int({ default: 512, max: 1512, step: 32, hideSlider: true }),
                                height: form.int({ default: 512, max: 1512, step: 32, hideSlider: true }),
                                batch: form.int({ default: 1, min: 1, max: 32, hideSlider: true }),
                            },
                        }),
                        pick_image: form.image(),
                    },
                }),
        }),
    }),
    run(run, ui) {
        console.log(`[🟢] done`)
    },
})
