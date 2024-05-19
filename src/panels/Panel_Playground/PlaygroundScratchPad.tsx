import { observer } from 'mobx-react-lite'

import { FormUI } from '../../controls/FormUI'
import { CushyErrorBoundarySimpleUI } from '../../controls/shared/CushyErrorBoundarySimple'
import { ThemeForm } from '../../theme/colorEngine/CushyTheming'
import { Box, BoxSubtle, BoxTitle } from '../../widgets/Box'

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
export const PlaygroundScratchPad = observer(function PlaygroundScratchPad_(p: {}) {
    return (
        <CushyErrorBoundarySimpleUI>
            <ThemeConfigUI />
        </CushyErrorBoundarySimpleUI>
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
    const theme = cushy.themeManager

    return (
        <div tw='w-full h-full bg-base-300 p-1'>
            {/* <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: -1 }}> */}
            <Box
                //
                tw='p-1 m-1 bd'
                background={{ type: 'absolute', lightness: 0.3, chroma: 0.05, hue: 0 }}
                text={{ type: 'relative', contrast: 1, chromaBlend: 1, hueShift: 45 }}
            >
                A 1
                <BoxTitle children='test' />
                <BoxSubtle children='test' />
                <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: 0.05 }}>
                    A 2
                </Box>
                <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: 0.05, hueShift: 80 }}>
                    A 3
                    <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: 0.05 }}>
                        A 4
                        <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: 0.05 }}>
                            A 5
                            <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: 0.05 }}>
                                A 6
                                <BoxTitle children='test' />
                                <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: 0.05, hueShift: 80 }}>
                                    A 7
                                    <Box tw='p-1 m-1 bd' background={{ type: 'relative', contrast: 0.05 }}>
                                        A 8
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <FormUI form={ThemeForm} />
        </div>
    )
})
