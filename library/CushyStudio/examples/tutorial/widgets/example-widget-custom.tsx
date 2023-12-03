import { CustomWidgetProps } from 'src'

/**🔶 This is an advanced example of providing your own custom react component to display in the form */
app({
    ui: (ui) => ({
        resetIt: ui.bool({ default: true }),
        cool: ui.custom({
            /**🔶 Provide your component */
            Component: MyCustomComponent,
            /**🔶 Provide your initial component state */
            default: {
                text: `initial text`,
                time: new Date(),
            },
        }),
    }),

    run: async (run, form) => {
        /**🔶 Get the view state during a run */
        const clickCount = form.cool.clickCount
        run.output_text({ title: `Just for clicks`, message: `You have clicked it ${clickCount ?? 0} times (before resetting)` })

        if (form.resetIt) {
            /**🔶 Set the view state during a run */
            run.formInstance.state.values.cool.componentState = {
                text: `yes`,
                time: new Date(),
                image: run.st.db.media_images.last()?.id,
            }
        }
    },
})

/**
 * Define your component
 * 📝 This needs to be a .tsx file
 * */
const MyCustomComponent = (
    p: CustomWidgetProps<{
        text: string
        time: Date
        image?: MediaImageID
        clickCount?: number
    }>,
) => {
    /**🔶 Get your values
     * 📝 The props.value is undefined by default, so this is a handy pattern */
    const { time, image, text, clickCount } = p.componentState

    /**🔶 Make a utility function so you can do partial updates without resetting all the other fields */
    const change = (value: Partial<MyCustomComponentState>) => {
        p.onChange({ ...p.componentState, ...value })
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex flex-row'>{text ?? `Nothing to see here!`}</div>
                <div className='flex flex-row'>{`last run: ${time}`}</div>
                <div>Here is an image:</div>
                <div>{image && <p.ui.image img={image} />}</div>

                <div
                    className='btn btn-outline'
                    onClick={() => {
                        change({ clickCount: (clickCount ?? 0) + 1 })
                    }}
                >
                    <div>Did you click it?</div>
                    <div>{clickCount ? `yes ${clickCount} times` : `nope`}</div>
                </div>
            </div>
        </>
    )
}
