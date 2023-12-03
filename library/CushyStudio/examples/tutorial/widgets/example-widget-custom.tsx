import { CustomWidgetProps } from 'src'

/**🔶 This is an advanced example of providing your own custom react component to display in the form */
app({
    ui: (ui) => ({
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

/**
 * Define your component
 * 📝 This needs to be a .tsx file
 * */
const MyCustomComponent = (
    p: CustomWidgetProps<{
        clickCount: number
        text: string
        time: Date
        image?: MediaImageID
    }>,
) => {
    /**🔶 Get your values
     * 📝 The props.value is undefined by default, so this is a handy pattern */
    const { time, image, text, clickCount } = p.widget.result

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex flex-row'>{text ?? `Nothing to see here!`}</div>
                <div className='flex flex-row'>{`last run: ${time}`}</div>
                <div>Here is an image:</div>
                <div>{image && <p.extra.ImageUI img={image} />}</div>

                <div className='btn btn-outline' onClick={() => p.widget.state.value.clickCount++}>
                    <div>Did you click it?</div>
                    <div>{clickCount ? `yes ${clickCount} times` : `nope`}</div>
                </div>
            </div>
        </>
    )
}
