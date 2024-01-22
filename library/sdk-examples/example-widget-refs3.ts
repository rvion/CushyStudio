import type { FormBuilder, Widget_selectOne } from 'src'
import { Widget_group } from 'src/controls/widgets/group/WidgetGroup'
import { Widget_choices } from 'src/controls/widgets/choices/WidgetChoices'
import { Widget_list } from 'src/controls/widgets/list/WidgetList'

app({
    ui: (form) => ({
        samplerUI: form.list({
            label: 'Sampler',
            showID: true,
            startCollapsed: true,
            defaultLength: 1,
            min: 1,
            element: () =>
                form.choice({
                    items: {
                        sampler_output: () =>
                            form.selectOne({
                                showID: true,
                                // if choices is a function, the form root is injected as first parameter
                                choices: (formRoot: Widget_group<any>) => {
                                    const steps = formRoot.values.samplerUI as Widget_list<any>
                                    return steps.items.map((choiceWidget: Widget_choices<any>, ix: number) => {
                                        if (choiceWidget == null) console.log(`[👙] 🔴1 choiceWidget is null`)
                                        const _selectOne = choiceWidget.firstActiveBranchWidget as Maybe<Widget_selectOne<any>>
                                        if (_selectOne == null) console.log(`[👙] 🔴 firstActiveBranchWidget is null`, _selectOne)
                                        const _actualChoice = _selectOne?.result
                                        return {
                                            id: _selectOne?.id,
                                            disabled: _actualChoice == null,
                                            name: _selectOne?.type ?? '❌ ERROR',
                                            label: `${ix + 1}th (${choiceWidget.firstActiveBranchName ?? '❓'})`,
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
    }),
    run(f, r) {},
})
