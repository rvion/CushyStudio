/** 📝 This needs to be a .tsx file */

import type { CustomWidgetProps } from 'src'

const MyCustomComponent = (
    p: CustomWidgetProps<{
        clickCount: number
        text: string
        time: Date
        image?: MediaImageID
    }>,
) => {
    const value = p.widget.state.value
    const img = value.image ?? p.widget.st().db.media_images.last()
    return (
        <div className='flex flex-col'>
            <input
                tw='input p-2'
                type='text'
                value={value.text ?? `Nothing to see here!`}
                onChange={(ev) => {
                    const text = ev.target.value
                    p.widget.state.value.text = text
                }}
            ></input>
            {/* <div className='flex flex-row'>{`last run: ${res.time}`}</div> */}
            <div>Here is an image:</div>
            {img && <p.extra.ImageUI img={img} />}
            <div className='btn btn-outline' onClick={() => p.widget.state.value.clickCount++}>
                <div>Did you click it?</div>
                <div>{value.clickCount ? `yes ${value.clickCount} times` : `nope`}</div>
            </div>
        </div>
    )
}

app({
    ui: (ui) => ({
        doc: ui.markdown({
            label: false,
            markdown: 'This is an advanced example of providing your own custom react component to display in the form',
        }),
        resetIt: ui.bool({ default: true }),
        cool: ui.custom({
            /**🔶 Provide your component */
            Component: MyCustomComponent,
            /**🔶 Provide your initial component state */
            defaultValue: () => ({
                clickCount: 0,
                text: `initial text`,
                time: new Date(),
            }),
        }),
    }),

    run: async (run, form) => {
        /**🔶 Get the view state during a run */
        const clickCount = form.cool.clickCount
        run.output_text({ title: `Just for clicks`, message: `You have clicked it ${clickCount ?? 0} times (before resetting)` })

        /**🔶 Set the view state during a run */
        if (form.resetIt) run.formInstance.state.values.cool.reset()
    },
})
