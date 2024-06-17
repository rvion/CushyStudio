import { test } from 'bun:test'

import { calcContrast as calcContrast_ } from '../index'
import { _assertCloseEnough } from './_assertSimilarOklch'
import { parse } from 'culori'

// ----------------------------------------
// Black and white
// ----------------------------------------
function calcContrast(fst: any, a: any, b: any, c: any) {
    return calcContrast_(parse(fst)!, a, b, c)
}
// APCA, P3
test('#0', () => {
    // White over black, oklch
    _assertCloseEnough(calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0)', 'apca', 'p3'), 107.88472611509847)

    // White over black, hex
    _assertCloseEnough(calcContrast('#ffffff', '#000000', 'apca', 'p3'), 107.88472611509847)

    // Black over white, oklch
    _assertCloseEnough(calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0)', 'apca', 'p3'), 106.04066682868863)

    // Black over white, hex
    _assertCloseEnough(calcContrast('#000000', '#ffffff', 'apca', 'p3'), 106.04066682868863)
})

// APCA, SRGB
test('#1', () => {
    // White over black, oklch
    _assertCloseEnough(calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0)', 'apca', 'srgb'), 107.88473318309848)

    // White over black, hex
    _assertCloseEnough(calcContrast('#ffffff', '#000000', 'apca', 'srgb'), 107.88473318309848)

    // Black over white, oklch
    _assertCloseEnough(calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0)', 'apca', 'srgb'), 106.04067321268862)

    // Black over white, hex
    _assertCloseEnough(calcContrast('#000000', '#ffffff', 'apca', 'srgb'), 106.04067321268862)
})

// WCAG, P3
test('#2', () => {
    // White over black, oklch
    _assertCloseEnough(calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0)', 'wcag', 'p3'), 21)

    // White over black, hex
    _assertCloseEnough(calcContrast('#ffffff', '#000000', 'wcag', 'p3'), 21)

    // Black over white, oklch
    _assertCloseEnough(calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0)', 'wcag', 'p3'), 21)

    // Black over white, hex
    _assertCloseEnough(calcContrast('#000000', '#ffffff', 'wcag', 'p3'), 21)
})

// WCAG, SRGB
test('#3', () => {
    // White over black, oklch
    _assertCloseEnough(calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0)', 'wcag', 'srgb'), 21)

    // White over black, hex
    _assertCloseEnough(calcContrast('#ffffff', '#000000', 'wcag', 'srgb'), 21)

    // Black over white, oklch
    _assertCloseEnough(calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0)', 'wcag', 'srgb'), 21)

    // Black over white, hex
    _assertCloseEnough(calcContrast('#000000', '#ffffff', 'wcag', 'srgb'), 21)
})

// ----------------------------------------
// Violet over Green
// ----------------------------------------

// APCA, P3
test('#4', () => {
    // #0 Original oklch, only first color is in P3
    _assertCloseEnough(
        calcContrast('oklch(40% 0.2 300)', 'oklch(84% 0.25 162)', 'apca', 'p3'),
        68.33018303187613,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly* equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.0776 0.9594 0.6201)',
            'apca',
            'p3',
        ),
        68.33405460235848,
    )

    // #3 Clamped to hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#5C11A0', '#00EEA5', 'apca', 'p3'), 66.25590425444918)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#54189A', '#14F59E', 'apca', 'p3'), 70.5345452208374)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly* equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.426 0.9195 0.6685)',
            'apca',
            'p3',
        ),
        66.25920464580895,
    )
})

// APCA, SRGB
test('#5', () => {
    // #0 Original oklch, only first color is in P3
    _assertCloseEnough(
        calcContrast('oklch(40% 0.2 300)', 'oklch(84% 0.25 162)', 'apca', 'srgb'),
        66.4370292268889,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly* equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.0776 0.9594 0.6201)',
            'apca',
            'srgb',
        ),
        66.4370292268889,
    )

    // #3 Clamped to hex
    // Value must be be close to #0
    // Hex is more rough format and loses some accuracy
    _assertCloseEnough(calcContrast('#5C11A0', '#00EEA5', 'apca', 'srgb'), 66.4370292268889)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#54189A', '#14F59E', 'apca', 'srgb'), 70.74731377064086)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly* equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.426 0.9195 0.6685)',
            'apca',
            'srgb',
        ),
        66.4370292268889,
    )
})

// WCAG, P3
test('#6', () => {
    // #0 Original oklch, only first color is in P3
    _assertCloseEnough(
        calcContrast('oklch(40% 0.2 300)', 'oklch(84% 0.25 162)', 'wcag', 'p3'),
        7.261025780390085,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly* equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.0776 0.9594 0.6201)',
            'wcag',
            'p3',
        ),
        7.261025780390085,
    )

    // #3 Clamped to hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#5C11A0', '#00EEA5', 'wcag', 'p3'), 6.742102558845356)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#54189A', '#14F59E', 'wcag', 'p3'), 7.387380536719613)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly* equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.426 0.9195 0.6685)',
            'wcag',
            'p3',
        ),
        6.742102558845356,
    )
})

// WCAG, SRGB
test('#7', () => {
    // #0 Original oklch, only first color is in P3
    _assertCloseEnough(
        calcContrast('oklch(40% 0.2 300)', 'oklch(84% 0.25 162)', 'wcag', 'srgb'),
        6.742102558845356,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly* equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.0776 0.9594 0.6201)',
            'wcag',
            'srgb',
        ),
        6.742102558845356,
    )

    // #3 Clamped to hex
    // Value must be be close to #0
    // Hex is more rough format and loses some accuracy
    _assertCloseEnough(calcContrast('#5C11A0', '#00EEA5', 'wcag', 'srgb'), 6.742102558845356)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#54189A', '#14F59E', 'wcag', 'srgb'), 7.387380536719613)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly* equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.3294 0.0942 0.603)',
            'color(display-p3 0.426 0.9195 0.6685)',
            'wcag',
            'srgb',
        ),
        6.742102558845356,
    )
})

// ----------------------------------------
// Yellow over Green
// ----------------------------------------

// APCA, P3
test('#8', () => {
    // #0 Original oklch, both colors are in P3
    _assertCloseEnough(
        calcContrast('oklch(94% 0.23 107)', 'oklch(55% 0.21 150)', 'apca', 'p3'),
        63.94684474879767,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly* equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9904 0.9543 0.0946)',
            'color(display-p3 0.0124 0.5535 0.1858)',
            'apca',
            'p3',
        ),
        63.94357140219613,
    )

    // #3 Clamped to hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#FCF200', '#00893D', 'apca', 'p3'), 64.60734027280559)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#FDF318', '#038D2F', 'apca', 'p3'), 63.82702945988926)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly* equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9814 0.9504 0.315)',
            'color(display-p3 0.2332 0.529 0.2731)',
            'apca',
            'p3',
        ),
        64.60967876148806,
    )
})

// APCA, SRGB
test('#9', () => {
    // #0 Original oklch, both colors are in P3
    _assertCloseEnough(
        calcContrast('oklch(94% 0.23 107)', 'oklch(55% 0.21 150)', 'apca', 'srgb'),
        64.79416214814182,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly* equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9904 0.9543 0.0946)',
            'color(display-p3 0.0124 0.5535 0.1858)',
            'apca',
            'srgb',
        ),
        64.79416214814182,
    )

    // #3 Clamped to hex
    // Value must be close to #0
    // Hex is more rough format and loses some accuracy
    _assertCloseEnough(calcContrast('#FCF300', '#00893D', 'apca', 'srgb'), 64.79416214814182)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#FDF318', '#038D2F', 'apca', 'srgb'), 63.51967605276941)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly* equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9814 0.9504 0.315)',
            'color(display-p3 0.2332 0.529 0.2731)',
            'apca',
            'srgb',
        ),
        64.32050759671479,
        4,
    )
})

// WCAG, P3
test('#10', () => {
    // #0 Original oklch, both colors are in P3
    _assertCloseEnough(
        calcContrast('oklch(94% 0.23 107)', 'oklch(55% 0.21 150)', 'wcag', 'p3'),
        3.669016369740913,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9904 0.9543 0.0946)',
            'color(display-p3 0.0124 0.5535 0.1858)',
            'wcag',
            'p3',
        ),
        3.669016369740913,
    )

    // #3 Clamped to hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#FCF200', '#00893D', 'wcag', 'p3'), 3.840140228749543)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#FDF318', '#038D2F', 'wcag', 'p3'), 3.709668307286619)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9814 0.9504 0.315)',
            'color(display-p3 0.2332 0.529 0.2731)',
            'wcag',
            'p3',
        ),
        3.840140228749543,
    )
})

// WCAG, SRGB
test('#11', () => {
    // #0 Original oklch, both colors are in P3
    _assertCloseEnough(
        calcContrast('oklch(94% 0.23 107)', 'oklch(55% 0.21 150)', 'wcag', 'srgb'),
        3.865838374606475,
    )

    // #1 Converted into display-p3 format
    // Value must be exactly equal to #0
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9904 0.9543 0.0946)',
            'color(display-p3 0.0124 0.5535 0.1858)',
            'wcag',
            'srgb',
        ),
        3.865838374606475,
    )

    // #3 Clamped to hex
    // Value must be close to #0
    // Hex is more rough format and loses some accuracy
    _assertCloseEnough(calcContrast('#FCF200', '#00893D', 'wcag', 'srgb'), 3.840140228749543)

    // #2 Converted to figma-p3 hex
    // Value must be different from #0
    _assertCloseEnough(calcContrast('#FDF318', '#038D2F', 'wcag', 'srgb'), 3.709668307286619)

    // #3 Clamped hex converted into display-p3 format
    // Value must be exactly equal to #3
    _assertCloseEnough(
        calcContrast(
            'color(display-p3 0.9814 0.9504 0.315)',
            'color(display-p3 0.2332 0.529 0.2731)',
            'wcag',
            'srgb',
        ),
        3.840140228749543,
        0 /* 🔴 */,
    )
})

// ----------------------------------------
// Semitrasparent text color
// ----------------------------------------

// APCA, P3
test('#12', () => {
    // Semitransparent White over Black, oklch
    _assertCloseEnough(
        calcContrast('oklch(100% 0 0 / 50%)', 'oklch(0% 0 0)', 'apca', 'p3'),
        34.52645905997656,
    )

    // Semitransparent White over Black, rgba
    _assertCloseEnough(
        calcContrast('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0)', 'apca', 'p3'),
        34.52645905997656,
    )

    // Semitransparent Black over White, oklch
    _assertCloseEnough(
        calcContrast('oklch(0% 0 0 / 50%)', 'oklch(100% 0 0)', 'apca', 'p3'),
        67.13321193532714,
    )

    // Semitransparent Black over White, rgbs
    _assertCloseEnough(
        calcContrast('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255)', 'apca', 'p3'),
        67.13321193532714,
    )

    // White over Semitransparent Black, oklch
    _assertCloseEnough(
        calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0 / 50%)', 'apca', 'p3'),
        107.88472611509847,
    )

    // White over Semitransparent Black, rgba
    _assertCloseEnough(
        calcContrast('rgba(255, 255, 255)', 'rgba(0, 0, 0, 0.5)', 'apca', 'p3'),
        107.88472611509847,
    )

    // Black over Semitransparent White, oklch
    _assertCloseEnough(
        calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0 / 50%)', 'apca', 'p3'),
        106.04066682868863,
    )

    // Black over Semitransparent White, rgbs
    _assertCloseEnough(
        calcContrast('rgba(0, 0, 0)', 'rgba(255, 255, 255, 0.5)', 'apca', 'p3'),
        106.04066682868863,
    )
})

// APCA, SRGB
test('#13', () => {
    // Semitransparent White over Black, oklch
    _assertCloseEnough(
        calcContrast('oklch(100% 0 0 / 50%)', 'oklch(0% 0 0)', 'apca', 'srgb'),
        34.629082804578125,
        0 /* 🔴 */,
    )

    // Semitransparent White over Black, rgba
    _assertCloseEnough(
        calcContrast('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0)', 'apca', 'srgb'),
        34.76384483419958,
    )

    // Semitransparent Black over White, oklch
    _assertCloseEnough(
        calcContrast('oklch(0% 0 0 / 50%)', 'oklch(100% 0 0)', 'apca', 'srgb'),
        67.03069788389881,
        0 /* 🔴 */,
    )

    // Semitransparent Black over White, rgbs
    _assertCloseEnough(
        calcContrast('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255)', 'apca', 'srgb'),
        66.89610313180029,
    )

    // White over Semitransparent Black, oklch
    _assertCloseEnough(
        calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0 / 50%)', 'apca', 'srgb'),
        107.88473318309848,
    )

    // White over Semitransparent Black, rgba
    _assertCloseEnough(
        calcContrast('rgba(255, 255, 255)', 'rgba(0, 0, 0, 0.5)', 'apca', 'srgb'),
        107.88473318309848,
    )

    // Black over Semitransparent White, oklch
    _assertCloseEnough(
        calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0 / 50%)', 'apca', 'srgb'),
        106.04067321268862,
    )

    // Black over Semitransparent White, rgbs
    _assertCloseEnough(
        calcContrast('rgba(0, 0, 0)', 'rgba(255, 255, 255, 0.5)', 'apca', 'srgb'),
        106.04067321268862,
    )
})

// WCAG, P3
test('#14', () => {
    // Semitransparent White over Black, oklch
    _assertCloseEnough(
        calcContrast('oklch(100% 0 0 / 50%)', 'oklch(0% 0 0)', 'wcag', 'p3'),
        5.317210002277984,
    )

    // Semitransparent White over Black, rgba
    _assertCloseEnough(
        calcContrast('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0)', 'wcag', 'p3'),
        5.317210002277984,
    )

    // Semitransparent Black over White, oklch
    _assertCloseEnough(
        calcContrast('oklch(0% 0 0 / 50%)', 'oklch(100% 0 0)', 'wcag', 'p3'),
        3.9494396480491156,
    )

    // Semitransparent Black over White, rgbs
    _assertCloseEnough(
        calcContrast('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255)', 'wcag', 'p3'),
        3.9494396480491156,
    )

    // White over Semitransparent Black, oklch
    _assertCloseEnough(calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0 / 50%)', 'wcag', 'p3'), 21)

    // White over Semitransparent Black, rgba
    _assertCloseEnough(calcContrast('rgba(255, 255, 255)', 'rgba(0, 0, 0, 0.5)', 'wcag', 'p3'), 21)

    // Black over Semitransparent White, oklch
    _assertCloseEnough(calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0 / 50%)', 'wcag', 'p3'), 21)

    // Black over Semitransparent White, rgbs
    _assertCloseEnough(calcContrast('rgba(0, 0, 0)', 'rgba(255, 255, 255, 0.5)', 'wcag', 'p3'), 21)
})

// WCAG, SRGB
test('#15', () => {
    // Semitransparent White over Black, oklch
    _assertCloseEnough(
        calcContrast('oklch(100% 0 0 / 50%)', 'oklch(0% 0 0)', 'wcag', 'srgb'),
        5.317210002277984,
    )

    // Semitransparent White over Black, rgba
    _assertCloseEnough(
        calcContrast('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0)', 'wcag', 'srgb'),
        5.317210002277984,
    )

    // Semitransparent Black over White, oklch
    _assertCloseEnough(
        calcContrast('oklch(0% 0 0 / 50%)', 'oklch(100% 0 0)', 'wcag', 'srgb'),
        3.9494396480491156,
    )

    // Semitransparent Black over White, rgbs
    _assertCloseEnough(
        calcContrast('rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255)', 'wcag', 'srgb'),
        3.9494396480491156,
    )

    // White over Semitransparent Black, oklch
    _assertCloseEnough(calcContrast('oklch(100% 0 0)', 'oklch(0% 0 0 / 50%)', 'wcag', 'srgb'), 21)

    // White over Semitransparent Black, rgba
    _assertCloseEnough(calcContrast('rgba(255, 255, 255)', 'rgba(0, 0, 0, 0.5)', 'wcag', 'srgb'), 21)

    // Black over Semitransparent White, oklch
    _assertCloseEnough(calcContrast('oklch(0% 0 0)', 'oklch(100% 0 0 / 50%)', 'wcag', 'srgb'), 21)

    // Black over Semitransparent White, rgbs
    _assertCloseEnough(calcContrast('rgba(0, 0, 0)', 'rgba(255, 255, 255, 0.5)', 'wcag', 'srgb'), 21)
})
