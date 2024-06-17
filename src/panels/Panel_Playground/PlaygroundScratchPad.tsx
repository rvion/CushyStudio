import { observer, useLocalObservable } from 'mobx-react-lite'

// import { FormManager } from '../../controls/FormManager'
import { FormUI } from '../../controls/FormUI'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { Frame } from '../../csuite/frame/Frame'
import { FrameBase } from '../../csuite/wrappers/FrameBase'
import { FrameSubtle } from '../../csuite/wrappers/FrameSubtle'
import { FrameTitle } from '../../csuite/wrappers/FrameTitle'

// import { ThemeForm } from '../../theme/colorEngine/CushyTheming'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundScratchPad = observer(function PlaygroundScratchPad_(p: {}) {
    return (
        <ErrorBoundaryUI>
            <ThemeConfigUI />
        </ErrorBoundaryUI>
    )
})

// FUCKING MAGICAL PROPERTIES: minimal direction reversal across the page
//
// -------------------
// starting with a "buffer" of 9/10 "auto" shifts to the darker color
// NOTES for self: Oscilating poitn should be .75 or something
// and .25 in the other direction
// => in means that the Context should track which direction we're moving
// -------------------
// background should string | Relative
// string means absolute
// and we convert strings to oklch to extract the components
// that's a way way better API for box
// -------------------
// 🟢 accent bleed (chroma blend) to rename (saturation multiplication?) should go past 1
// ---------------------
// relative colors
// 🟢 add chroma bonus (applied beofre contrast)

export const ThemeConfigUI = observer(function ThemeConfigUI_(p: {}) {
    // const theme = cushy.themeManager

    const uist = useLocalObservable(() => ({
        // base: 'oklch(.1,.2,200)',
        base: 'oklch(.3 0.05 0)',
    }))
    return (
        <div tw='w-full h-full p-1'>
            {/* <Box tw='p-1 m-1 bd' background={{ contrast: -1 }}> */}
            <Frame
                //
                tw='p-1 m-1'
                base={uist.base /* 'oklch(.3 0.05 0)' */}
                border={20}
                text={{ contrast: 1, chromaBlend: 1, hueShift: 45 }}
            >
                <FormUI
                    theme={{
                        base: uist.base,
                        text: { contrast: 1, chromaBlend: 10, hueShift: 145 },
                    }}
                    form={cushy.forms.use((ui) =>
                        ui.fields({
                            col: ui.colorV2({ onValueChange: (v) => (uist.base = v) }),
                            foo: ui.string(),
                            bar: ui.int().list({ min: 3 }),
                            baz: ui.fields({
                                xx: ui.fields({
                                    a: ui.string(),
                                    b: ui.string(),
                                }),
                                yy: ui.fields({
                                    c: ui.string(),
                                    d: ui.string(),
                                }),
                            }),
                        }),
                    )}
                />
                A 1
                <FrameBase border tw='p-1'>
                    <FrameBase border tw='p-1'>
                        <FrameBase border>yay</FrameBase>
                    </FrameBase>
                </FrameBase>
                <FrameTitle children='test' />
                <FrameSubtle children='test' />
                <Frame tw='p-1 m-1' base={{ contrast: 0.05 }}>
                    A 2
                    <FrameSubtle>
                        test 1
                        <FrameSubtle children='test 2' />
                    </FrameSubtle>
                </Frame>
                <Frame tw='p-1 m-1 _bd' border={{ contrast: 1, chromaBlend: 1 }} base={{ contrast: 0.05, hueShift: 80 }}>
                    A 3
                    <Frame tw='p-1 m-1 _bd' border={20} base={20}>
                        A 4
                        <Frame tw='p-1 m-1 _bd' border={20} base={20}>
                            A 5
                            <Frame tw='p-1 m-1 _bd' border={20} base={20}>
                                A 6
                                <FrameTitle tw='text-xl font-bold' children='Test' />
                                <Frame
                                    tw='p-1 m-1 _bd'
                                    border={{ contrast: 0.3, chromaBlend: 1 }}
                                    base={{ contrast: 0.0, hueShift: 30 }}
                                >
                                    A 7
                                    <Frame tw='p-1 m-1 _bd' border={{ contrast: 0.3, chromaBlend: 1 }} base={{ contrast: 0.05 }}>
                                        A 8
                                    </Frame>
                                </Frame>
                            </Frame>
                        </Frame>
                    </Frame>
                </Frame>
            </Frame>
            {/* <FormUI form={ThemeForm} /> */}
        </div>
    )
})
