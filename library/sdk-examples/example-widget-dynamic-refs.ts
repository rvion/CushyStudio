import type { Widget_selectOne } from 'src'
import type { Widget_choices } from 'src/controls/widgets/choices/WidgetChoices'
import type { Widget_group } from 'src/controls/widgets/group/WidgetGroup'
import type { Widget_list } from 'src/controls/widgets/list/WidgetList'

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
                        sampler_output_abc_asdf: () =>
                            form.selectOne({
                                // showID: true,
                                // if choices is a function, the form root is injected as first parameter
                                choices: (formRoot: Widget_group<any>) => {
                                    const steps = formRoot.fields.samplerUI as Widget_list<any>
                                    return steps.items.map((choiceWidget: Widget_choices<any>, ix: number) => {
                                        if (choiceWidget == null) console.log(`[🔴] err 1: choiceWidget is null`)
                                        const _selectOne = choiceWidget.firstActiveBranchWidget as Maybe<Widget_selectOne<any>>
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
                        empty_latent: () =>
                            form.group({
                                layout: 'H',
                                // topLevel: true,
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
    }),
    run(run, ui) {
        console.log(`[🟢] done`)
    },
})
