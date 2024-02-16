/** 📝 This needs to be a .tsx file */

import type { CustomWidgetProps } from 'src/controls/widgets/custom/WidgetCustom'
import { observer } from 'mobx-react-lite'
import { MyCustomComponent2 } from './example-widget-custom-2'
import Confetti from 'react-confetti'

const MyCustomComponent = observer(function (
    p: CustomWidgetProps<{
        clickCount: number
        text: string
        image?: MediaImageID
    }>,
) {
    const value = p.widget.serial.value
    const img = value.image ?? cushy.db.media_images.last()
    return (
        <div className='flex flex-col gap-2 virtualBorder p-2'>
            {/* Text Input -------------------------------------------------------- */}
            type "reset" in the field here and press play to reset the state
            <input
                tw='input input-bordered p-2'
                value={value.text ?? `Nothing to see here!`}
                onChange={(ev) => (value.text = ev.target.value)}
            />
            {/* Button -------------------------------------------------------- */}
            <div className='btn btn-outline btn-primary btn-sm' onClick={() => value.clickCount++}>
                <div>Did you click it?</div>
                <div>{value.clickCount ? `yes ${value.clickCount} times` : `nope`}</div>
            </div>
            {/* extra components -------------------------------------------------------- */}
            <p.extra.JsonViewUI value={value} />
            {img && <p.extra.ImageUI img={img} />}
            {/* imported file -------------------------------------------------------- */}
            <MyCustomComponent2 text={value.text} />
            {/* imported file -------------------------------------------------------- */}
            <div tw='relative' style={{ height: '300px', width: '300px' }}>
                <Confetti width={300} height={300} />
            </div>
        </div>
    )
})

app({
    ui: (ui) => ({
        // doc: ui.markdown('This is an advanced example of providing your own custom react component to display in the form'),
        demo: ui.custom({
            /** 📝 Provide your component and default value */
            Component: MyCustomComponent,
            defaultValue: () => ({
                clickCount: 0,
                text: `initial text`,
            }),
        }),
    }),

    run: async (run, ui) => {
        /** 📝 Get the view state during a run */
        const clickCount = ui.demo.clickCount
        run.output_text(`You have clicked it ${clickCount ?? 0} times (before resetting)`)

        /** 📝 programmatically reset the state from the UI */
        if (ui.demo.text === 'reset') run.formInstance.fields.demo.reset()
    },
})
