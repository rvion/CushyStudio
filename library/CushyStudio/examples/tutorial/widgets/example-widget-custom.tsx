import { Widget_custom_componentProps } from 'src'

/**🔶 This is an advanced example of providing your own custom react component to display in the form */
app({
    ui: (ui) => ({
        updateIt: ui.bool({ default: true }),
        cool: ui.custom({
            /**🔶 Provide your component */
            customComponent: MyCustomComponent,
        }),
    }),

    run: async (run, form) => {
        if (form.updateIt) {
            /**🔶 Set the view state during a run */
            run.formInstance.state.values.cool.componentViewState = {
                text: `yes`,
                time: new Date(),
                image: run.st.db.media_images.last()?.id,
            }
        }
    },
})

/**🔶 Define your own view state types */
type MyCustomComponentPropsValue = {
    text: string
    time: Date
    image?: MediaImageID
    clickCount?: number
}

/**🔶 Define your component
 *  Note: This needs to be a .tsx file */
function MyCustomComponent(props: Widget_custom_componentProps<MyCustomComponentPropsValue>) {
    /**🔶 Get your values
     * Note: The props.value is undefined by default, so this is a handy pattern */
    const { time, image, text, clickCount } = props.value ?? {}

    /**🔶 Make a utility function so you can do partial updates without resetting all the other fields */
    const change = (value: Partial<MyCustomComponentPropsValue>) => {
        props.onChange({ ...(props.value ?? {}), ...value })
    }

    return (
        <>
            <div className='flex flex-col'>
                <div className='flex flex-row'>{text ?? `Nothing to see here!`}</div>
                <div className='flex flex-row'>{`last run: ${time}`}</div>
                <div>Here is an image:</div>
                <div>{image && <props.ui.image img={image} />}</div>

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
