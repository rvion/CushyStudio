import type { FormBuilder, Widget_list, Widget_selectOne } from 'src'
import { Widget_group } from 'src/controls/widgets/WidgetIGroupUI'
import { Widget_choices } from 'src/controls/widgets2/WidgetChoices'

app({
    ui: (form) => ({
        samplerUI: form.list({
            label: 'Sampler',
            showID: true,
            startCollapsed: true,
            defaultLength: 1,
            min: 1,
            element: () => ui_sampler(form),
        }),
    }),
    run(f, r) {
        //
    },
})

const ui_sampler = (form: FormBuilder) =>
    form.group({
        label: '',
        topLevel: true,
        className: 'relative',
        items: () => ({
            source: form.choice({
                items: {
                    sampler_output: () =>
                        form.selectOne({
                            showID: true,
                            // if choices is a function, the form root is injected as first parameter
                            choices: (formRoot: Maybe<Widget_group<any>>) => {
                                // handle the case where the form is not yet initialized
                                if (formRoot == null) return []

                                // get the list widget
                                // (no type-safety, because the input references itself)
                                const listW = formRoot.values.samplerUI as Widget_list<any>

                                return listW.items.map((item: Widget_group<any>, ix: number) => {
                                    const _choice = item.values.source as Widget_choices<any>
                                    const _selectOne = _choice.firstActiveBranchWidget as Widget_selectOne<any>
                                    const _actualChoice = _selectOne.result
                                    return {
                                        id: _selectOne.id,
                                        disabled: _actualChoice == null,
                                        name: _selectOne.type,
                                        label: `${ix + 1}th (${_choice.firstActiveBranchName ?? '❓'})`,
                                    }
                                })
                            },
                        }),
                    empty_latent: () =>
                        form.group({
                            label: '',
                            layout: 'H',
                            topLevel: true,
                            items: () => ({
                                width: form.int({ default: 512, max: 1512, step: 32, hideSlider: true }),
                                height: form.int({ default: 512, max: 1512, step: 32, hideSlider: true }),
                                batch: form.int({ default: 1, min: 1, max: 32, hideSlider: true }),
                            }),
                        }),
                    pick_image: () => form.image({}),
                },
            }),
        }),
    })
