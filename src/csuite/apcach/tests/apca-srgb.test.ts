import { expect, test } from 'bun:test'

import { apcach, apcachToCss, crToBg, crToFg, cssToApcach, maxChroma } from '../index'
import { _assertSimilarOklch } from './_assertSimilarOklch'

// ----------------------------------------
// CONTRAST BELOW THRESHOLD
// ----------------------------------------

// White bg, gray
test('#0', () => {
    _assertSimilarOklch(apcachToCss(apcach(5, 0, 0, 100, 'srgb')), 'oklch(100% 0 0)')
})

// Black bg, low chroma
test('#1', () => {
    _assertSimilarOklch(apcachToCss(apcach(crToBg('black', 5), 0.05, 200, 100, 'srgb')), 'oklch(0% 0.05 200)')
})

// Gray fg, high chroma
test('#2', () => {
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 5), 3, 100, 100, 'srgb')),
        'oklch(58.97123297174118% 3 100)',
    )
})

// Colored fg, gray
test('#3', () => {
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#00FF94', 5), 0, 70, 100, 'srgb')),
        'oklch(87.82585371306136% 0 70)',
    )
})

// ----------------------------------------
// CREATION
// ----------------------------------------

// Implicit white bg
test('#4', () => {
    _assertSimilarOklch(
        apcachToCss(apcach(70, 0.15, 150, 100, 'srgb')),
        'oklch(55.566405559494214% 0.15 150)',
    )
})

// Explicit white bg
test('#5', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 70), 0.15, 300, 100, 'srgb')),
        'oklch(58.9843742670202% 0.15 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 70, 'apca', 'auto'), 0.15, 300, 100, 'srgb')),
        'oklch(58.9843742670202% 0.15 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 70, 'apca', 'darker'), 0.15, 300, 100, 'srgb')),
        'oklch(58.9843742670202% 0.15 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 70, 'apca', 'lighter'), 0.15, 300, 100, 'srgb')),
        'oklch(100% 0.15 300)',
    )
})

// Black bg
test('#6', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 70), 0.2, 150, 100, 'srgb')),
        'oklch(78.9794921875% 0.2 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 70, 'apca', 'auto'), 0.2, 150, 100, 'srgb')),
        'oklch(78.9794921875% 0.2 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 70, 'apca', 'darker'), 0.2, 150, 100, 'srgb')),
        'oklch(0% 0.2 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 70, 'apca', 'lighter'), 0.2, 150, 100, 'srgb')),
        'oklch(78.9794921875% 0.2 150)',
    )
})

// Light gray bg
test('#7', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 70), 0.1, 150, 100, 'srgb')),
        'oklch(40.2807421875% 0.1 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 70, 'apca', 'auto'), 0.1, 150, 100, 'srgb')),
        'oklch(40.2807421875% 0.1 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 70, 'apca', 'darker'), 0.1, 150, 100, 'srgb')),
        'oklch(40.2807421875% 0.1 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 70, 'apca', 'lighter'), 0.1, 150, 100, 'srgb')),
        'oklch(100% 0.1 150)',
    )
})

// Dark gray bg
test('#8', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 65), 0.1, 50, 100, 'srgb')),
        'oklch(82.24642634799008% 0.1 50)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 65, 'apca', 'auto'), 0.1, 50, 100, 'srgb')),
        'oklch(82.24642634799008% 0.1 50)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 65, 'apca', 'darker'), 0.1, 50, 100, 'srgb')),
        'oklch(0% 0.1 50)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 65, 'apca', 'lighter'), 0.1, 50, 100, 'srgb')),
        'oklch(82.24642634799008% 0.1 50)',
    )
})

// Mid gray bg
test('#9', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 20), 0, 0, 100, 'srgb')),
        'oklch(41.003435425663795% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 20, 'apca', 'auto'), 0, 0, 100, 'srgb')),
        'oklch(41.003435425663795% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 20, 'apca', 'darker'), 0, 0, 100, 'srgb')),
        'oklch(41.003435425663795% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 20, 'apca', 'lighter'), 0, 0, 100, 'srgb')),
        'oklch(72.75433439529687% 0 0)',
    )
})

// Mid gray bg
test('#10', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 20), 0, 0, 100, 'srgb')),
        'oklch(57.331842141992205% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 20, 'apca', 'auto'), 0, 0, 100, 'srgb')),
        'oklch(57.331842141992205% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 20, 'apca', 'darker'), 0, 0, 100, 'srgb')),
        'oklch(0% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 20, 'apca', 'lighter'), 0, 0, 100, 'srgb')),
        'oklch(57.331842141992205% 0 0)',
    )
})

// Mid gray bg, high contrast
test('#11', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 70), 0, 0, 100, 'srgb')),
        'oklch(98.6178617272248% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 70, 'apca', 'auto'), 0, 0, 100, 'srgb')),
        'oklch(98.6178617272248% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 70, 'apca', 'darker'), 0, 0, 100, 'srgb')),
        'oklch(0% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 70, 'apca', 'lighter'), 0, 0, 100, 'srgb')),
        'oklch(98.39731378795865% 0 0)',
    )
})

// Colored bg
test('#12', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#03F59E', 70), 0.14, 300, 100, 'srgb')),
        'oklch(39.500570508431956% 0.14 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#03F59E', 70, 'apca', 'auto'), 0.14, 300, 100, 'srgb')),
        'oklch(39.500570508431956% 0.14 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#03F59E', 70, 'apca', 'darker'), 0.14, 300, 100, 'srgb')),
        'oklch(39.500570508431956% 0.14 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#03F59E', 70, 'apca', 'lighter'), 0.14, 300, 100, 'srgb')),
        'oklch(100% 0.14 300)',
    )
})

// Colored dark bg
test('#13', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#5E4192', 70), 0.2, 120, 100, 'srgb')),
        'oklch(88.46530873050969% 0.2 120)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#5E4192', 70, 'apca', 'auto'), 0.2, 120, 100, 'srgb')),
        'oklch(88.46530873050969% 0.2 120)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#5E4192', 70, 'apca', 'darker'), 0.2, 120, 100, 'srgb')),
        'oklch(0% 0.2 120)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#5E4192', 70, 'apca', 'lighter'), 0.2, 120, 100, 'srgb')),
        'oklch(88.46530873050969% 0.2 120)',
    )
})

// White fg
test('#14', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 65), 0.15, 150, 100, 'srgb')),
        'oklch(62.890624218478486% 0.15 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 65, 'apca', 'auto'), 0.15, 150, 100, 'srgb')),
        'oklch(62.890624218478486% 0.15 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 65, 'apca', 'darker'), 0.15, 150, 100, 'srgb')),
        'oklch(62.890624218478486% 0.15 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 65, 'apca', 'lighter'), 0.15, 150, 100, 'srgb')),
        'oklch(100% 0.15 150)',
    )
})

// Black fg
test('#15', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 70), 0.2, 150, 100, 'srgb')),
        'oklch(78.41796875% 0.2 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 70, 'apca', 'auto'), 0.2, 150, 100, 'srgb')),
        'oklch(78.41796875% 0.2 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 70, 'apca', 'darker'), 0.2, 150, 100, 'srgb')),
        'oklch(0% 0.2 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 70, 'apca', 'lighter'), 0.2, 150, 100, 'srgb')),
        'oklch(78.41796875% 0.2 150)',
    )
})

// Light gray fg
test('#16', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 70), 0.1, 150, 100, 'srgb')),
        'oklch(42.919218750000006% 0.1 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 70, 'apca', 'auto'), 0.1, 150, 100, 'srgb')),
        'oklch(42.919218750000006% 0.1 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 70, 'apca', 'darker'), 0.1, 150, 100, 'srgb')),
        'oklch(42.919218750000006% 0.1 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 70, 'apca', 'lighter'), 0.1, 150, 100, 'srgb')),
        'oklch(100% 0.1 150)',
    )
})

// Dark gray fg
test('#17', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 65), 0.1, 50, 100, 'srgb')),
        'oklch(82.24642634799008% 0.1 50)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 65, 'apca', 'auto'), 0.1, 50, 100, 'srgb')),
        'oklch(82.24642634799008% 0.1 50)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 65, 'apca', 'darker'), 0.1, 50, 100, 'srgb')),
        'oklch(0% 0.1 50)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 65, 'apca', 'lighter'), 0.1, 50, 100, 'srgb')),
        'oklch(82.24642634799008% 0.1 50)',
    )
})

// Mid gray fg
test('#18', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 20), 0, 0, 100, 'srgb')),
        'oklch(41.003435425663795% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 20, 'apca', 'auto'), 0, 0, 100, 'srgb')),
        'oklch(41.003435425663795% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 20, 'apca', 'darker'), 0, 0, 100, 'srgb')),
        'oklch(41.003435425663795% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 20, 'apca', 'lighter'), 0, 0, 100, 'srgb')),
        'oklch(73.71594612252169% 0 0)',
    )
})

// Mid gray fg
test('#19', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 20), 0, 0, 100, 'srgb')),
        'oklch(57.331842141992205% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 20, 'apca', 'auto'), 0, 0, 100, 'srgb')),
        'oklch(57.331842141992205% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 20, 'apca', 'darker'), 0, 0, 100, 'srgb')),
        'oklch(0% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 20, 'apca', 'lighter'), 0, 0, 100, 'srgb')),
        'oklch(57.331842141992205% 0 0)',
    )
})

// Mid gray fg, high contrast
test('#20', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 60), 0, 0, 100, 'srgb')),
        'oklch(96.08394156047031% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 60, 'apca', 'auto'), 0, 0, 100, 'srgb')),
        'oklch(96.08394156047031% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 60, 'apca', 'darker'), 0, 0, 100, 'srgb')),
        'oklch(0% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 60, 'apca', 'lighter'), 0, 0, 100, 'srgb')),
        'oklch(96.15355309110075% 0 0)',
    )
})

// Colored fg
test('#21', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#03F59E', 70), 0.14, 300, 100, 'srgb')),
        'oklch(41.83887066537931% 0.14 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#03F59E', 70, 'apca', 'auto'), 0.14, 300, 100, 'srgb')),
        'oklch(41.83887066537931% 0.14 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#03F59E', 70, 'apca', 'darker'), 0.14, 300, 100, 'srgb')),
        'oklch(41.83887066537931% 0.14 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#03F59E', 70, 'apca', 'lighter'), 0.14, 300, 100, 'srgb')),
        'oklch(100% 0.14 300)',
    )
})

// Colored dark fg
test('#22', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#5E4192', 70), 0.2, 120, 100, 'srgb')),
        'oklch(89.88019492594952% 0.2 120)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#5E4192', 70, 'apca', 'auto'), 0.2, 120, 100, 'srgb')),
        'oklch(89.88019492594952% 0.2 120)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#5E4192', 70, 'apca', 'darker'), 0.2, 120, 100, 'srgb')),
        'oklch(0% 0.2 120)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#5E4192', 70, 'apca', 'lighter'), 0.2, 120, 100, 'srgb')),
        'oklch(89.88019492594952% 0.2 120)',
    )
})

// High contrast
test('#23', () => {
    // Implicit search direction
    _assertSimilarOklch(apcachToCss(apcach(70, 0.4, 150, 100, 'srgb')), 'oklch(55.468749310707764% 0.4 150)')
})

// White bg, maxChroma
test('#24', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#FFFFFF', 70), maxChroma(), 200, 100, 'srgb')),
        'oklch(56.15234338352428% 0.09531250000000001 200)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#FFFFFF', 70, 'apca', 'auto'), maxChroma(), 200, 100, 'srgb')),
        'oklch(56.15234338352428% 0.09531250000000001 200)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#FFFFFF', 70, 'apca', 'darker'), maxChroma(), 200, 100, 'srgb')),
        'oklch(56.15234338352428% 0.09531250000000001 200)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#FFFFFF', 70, 'apca', 'lighter'), maxChroma(), 200, 100, 'srgb')),
        'oklch(100% 0 200)',
    )
})

// White bg, maxChroma capped
test('#25', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#000000', 70), maxChroma(0.1), 100, 100, 'srgb')),
        'oklch(81.25% 0.1 100)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#000000', 70, 'apca', 'auto'), maxChroma(0.1), 100, 100, 'srgb')),
        'oklch(81.25% 0.1 100)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#000000', 70, 'apca', 'darker'), maxChroma(0.1), 100, 100, 'srgb')),
        'oklch(0% 0 100)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#000000', 70, 'apca', 'lighter'), maxChroma(0.1), 100, 100, 'srgb')),
        'oklch(81.25% 0.1 100)',
    )
})

// Almost too high contrast, maxChroma
test('#26', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 50), maxChroma(0.2), 300, 100, 'srgb')),
        'oklch(25.20271806744998% 0.13281250000000003 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 50, 'apca', 'auto'), maxChroma(0.2), 300, 100, 'srgb')),
        'oklch(25.20271806744998% 0.13281250000000003 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 50, 'apca', 'darker'), maxChroma(0.2), 300, 100, 'srgb')),
        'oklch(25.20271806744998% 0.13281250000000003 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 50, 'apca', 'lighter'), maxChroma(0.1), 300, 100, 'srgb')),
        'oklch(97.66972288882117% 0.012500000000000004 300)',
    )
})

// Too high contrast, maxChroma
test('#27', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 60), maxChroma(0.2), 300, 100, 'srgb')),
        'oklch(0% 0 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 60, 'apca', 'auto'), maxChroma(0.2), 300, 100, 'srgb')),
        'oklch(0% 0 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 60, 'apca', 'darker'), maxChroma(0.2), 300, 100, 'srgb')),
        'oklch(0% 0 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 60, 'apca', 'lighter'), maxChroma(0.2), 300, 100, 'srgb')),
        'oklch(100% 0 300)',
    )
})

// ----------------------------------------
// RESTORATION
// ----------------------------------------

// Restore apcach
test('#28', () => {
    // Implicit search direction
    expect(apcachToCss(cssToApcach('#C9EB2B', { bg: '#5E4192' }, 'srgb', 'apca'), 'hex')) //
        .toBe('#c9eb2b')
})
