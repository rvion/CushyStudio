import { expect, test } from 'bun:test'

import { apcach, apcachToCss, crToBg, crToFg, cssToApcach, maxChroma } from '../index'
import { _assertSimilarOklch } from './_assertSimilarOklch'

// ----------------------------------------
// CONTRAST BELOW THRESHOLD
// ----------------------------------------

// White bg, gray
test('#0', () => {
    _assertSimilarOklch(apcachToCss(apcach(crToBg('white', 0.2, 'wcag'), 0, 0, 100, 'p3')), 'oklch(100% 0 0)')
})

// Black bg, low chroma
test('#1', () => {
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 0.2, 'wcag'), 0.05, 200, 100, 'p3')),
        'oklch(0% 0.05 200)',
    )
})

// Gray fg, high chroma
test('#2', () => {
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 0.2, 'wcag'), 3, 100, 100, 'p3')),
        'oklch(58.97123297174118% 3 100)',
    )
})

// Colored fg, gray
test('#3', () => {
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#00FF94', 0.2, 'wcag'), 0, 70, 100, 'p3')),
        'oklch(87.82585371306136% 0 70)',
    )
})

// ----------------------------------------
// CREATION
// ----------------------------------------

// Implicit white bg
test('#4', () => {
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 4.5, 'wcag'), 0.15, 150, 100, 'p3')),
        'oklch(55.27343713926044% 0.15 150)',
    )
})

// Explicit white bg
test('#5', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag'), 0.28, 300, 100, 'p3')),
        'oklch(57.81249962268939% 0.28 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag', 'auto'), 0.28, 300, 100, 'p3')),
        'oklch(57.81249962268939% 0.28 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag', 'darker'), 0.28, 300, 100, 'p3')),
        'oklch(57.81249962268939% 0.28 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag', 'lighter'), 0.28, 300, 100, 'p3')),
        'oklch(100% 0.28 300)',
    )
})

// Black bg
test('#6', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag'), 0.2, 150, 100, 'p3')),
        'oklch(55.95703125% 0.2 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag', 'auto'), 0.2, 150, 100, 'p3')),
        'oklch(55.95703125% 0.2 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag', 'darker'), 0.2, 150, 100, 'p3')),
        'oklch(0% 0.2 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag', 'lighter'), 0.2, 150, 100, 'p3')),
        'oklch(55.95703125% 0.2 150)',
    )
})

// Light gray bg
test('#7', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 5, 'wcag'), 0.14, 150, 100, 'p3')),
        'oklch(45.7555810546875% 0.14 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 5, 'wcag', 'auto'), 0.14, 150, 100, 'p3')),
        'oklch(45.7555810546875% 0.14 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 5, 'wcag', 'darker'), 0.14, 150, 100, 'p3')),
        'oklch(45.7555810546875% 0.14 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('oklch(90.06% 0 89.88)', 5, 'wcag', 'lighter'), 0.14, 150, 100, 'p3')),
        'oklch(100% 0.14 150)',
    )
})

// Dark gray bg
test('#8', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 5, 'wcag'), 0.1, 50, 100, 'p3')),
        'oklch(70.5017545474297% 0.1 50)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 5, 'wcag', 'auto'), 0.1, 50, 100, 'p3')),
        'oklch(70.5017545474297% 0.1 50)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 5, 'wcag', 'darker'), 0.1, 50, 100, 'p3')),
        'oklch(0% 0.1 50)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('hsl(223.81 0% 18%)', 5, 'wcag', 'lighter'), 0.1, 50, 100, 'p3')),
        'oklch(70.5017545474297% 0.1 50)',
    )
})

// Mid gray bg
test('#9', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 2, 'wcag'), 0, 0, 100, 'p3')),
        'oklch(42.385573698438975% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 2, 'wcag', 'auto'), 0, 0, 100, 'p3')),
        'oklch(42.385573698438975% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 2, 'wcag', 'darker'), 0, 0, 100, 'p3')),
        'oklch(42.385573698438975% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 2, 'wcag', 'lighter'), 0, 0, 100, 'p3')),
        'oklch(77.24185578901267% 0 0)',
    )
})

// Mid gray bg
test('#10', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 2, 'wcag'), 0, 0, 100, 'p3')),
        'oklch(54.92121175453411% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 2, 'wcag', 'auto'), 0, 0, 100, 'p3')),
        'oklch(54.92121175453411% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 2, 'wcag', 'darker'), 0, 0, 100, 'p3')),
        'oklch(14.357948280402544% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#434343', 2, 'wcag', 'lighter'), 0, 0, 100, 'p3')),
        'oklch(54.92121175453411% 0 0)',
    )
})

// Mid gray bg, high contrast
test('#11', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 4, 'wcag'), 0, 0, 100, 'p3')),
        'oklch(23.957063394769854% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 4, 'wcag', 'auto'), 0, 0, 100, 'p3')),
        'oklch(23.957063394769854% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 4, 'wcag', 'darker'), 0, 0, 100, 'p3')),
        'oklch(23.957063394769854% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#7D7D7D', 4, 'wcag', 'lighter'), 0, 0, 100, 'p3')),
        'oklch(99.0383882727752% 0 0)',
    )
})

// Colored bg
test('#12', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('color(display-p3 0.012 0.961 0.620)', 5, 'wcag'), 0.14, 300, 100, 'p3')),
        'oklch(47.752503319582054% 0.14 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToBg('color(display-p3 0.012 0.961 0.620)', 5, 'wcag', 'auto'), 0.14, 300, 100, 'p3'),
        ),
        'oklch(47.752503319582054% 0.14 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToBg('color(display-p3 0.012 0.961 0.620)', 5, 'wcag', 'darker'), 0.14, 300, 100, 'p3'),
        ),
        'oklch(47.752503319582054% 0.14 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToBg('color(display-p3 0.012 0.961 0.620)', 5, 'wcag', 'lighter'), 0.14, 300, 100, 'p3'),
        ),
        'oklch(100% 0.14 300)',
    )
})

// Colored dark bg
test('#13', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag'), 0.2, 120, 100, 'p3')),
        'oklch(84.20655667477361% 0.2 120)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToBg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag', 'auto'), 0.2, 120, 100, 'p3'),
        ),
        'oklch(84.20655667477361% 0.2 120)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToBg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag', 'darker'), 0.2, 120, 100, 'p3'),
        ),
        'oklch(0% 0.2 120)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToBg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag', 'lighter'), 0.2, 120, 100, 'p3'),
        ),
        'oklch(84.20655667477361% 0.2 120)',
    )
})

// White fg
test('#14', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 5, 'wcag'), 0.18, 150, 100, 'p3')),
        'oklch(51.757812162205006% 0.18 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 5, 'wcag', 'auto'), 0.18, 150, 100, 'p3')),
        'oklch(51.757812162205006% 0.18 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 5, 'wcag', 'darker'), 0.18, 150, 100, 'p3')),
        'oklch(51.757812162205006% 0.18 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('white', 5, 'wcag', 'lighter'), 0.18, 150, 100, 'p3')),
        'oklch(100% 0.18 150)',
    )
})

// Black fg
test('#15', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 5, 'wcag'), 0.2, 150, 100, 'p3')),
        'oklch(55.95703125% 0.2 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 5, 'wcag', 'auto'), 0.2, 150, 100, 'p3')),
        'oklch(55.95703125% 0.2 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 5, 'wcag', 'darker'), 0.2, 150, 100, 'p3')),
        'oklch(0% 0.2 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('black', 5, 'wcag', 'lighter'), 0.2, 150, 100, 'p3')),
        'oklch(55.95703125% 0.2 150)',
    )
})

// Light gray fg
test('#16', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 5, 'wcag'), 0.14, 150, 100, 'p3')),
        'oklch(45.7555810546875% 0.14 150)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 5, 'wcag', 'auto'), 0.14, 150, 100, 'p3')),
        'oklch(45.7555810546875% 0.14 150)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 5, 'wcag', 'darker'), 0.14, 150, 100, 'p3')),
        'oklch(45.7555810546875% 0.14 150)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('oklch(90.06% 0 89.88)', 5, 'wcag', 'lighter'), 0.14, 150, 100, 'p3')),
        'oklch(100% 0.14 150)',
    )
})

// Dark gray fg
test('#17', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 5, 'wcag'), 0.1, 50, 100, 'p3')),
        'oklch(70.5017545474297% 0.1 50)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 5, 'wcag', 'auto'), 0.1, 50, 100, 'p3')),
        'oklch(70.5017545474297% 0.1 50)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 5, 'wcag', 'darker'), 0.1, 50, 100, 'p3')),
        'oklch(0% 0.1 50)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('hsl(223.81 0% 18%)', 5, 'wcag', 'lighter'), 0.1, 50, 100, 'p3')),
        'oklch(70.5017545474297% 0.1 50)',
    )
})

// Mid gray fg
test('#18', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 2, 'wcag'), 0, 0, 100, 'p3')),
        'oklch(42.385573698438975% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 2, 'wcag', 'auto'), 0, 0, 100, 'p3')),
        'oklch(42.385573698438975% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 2, 'wcag', 'darker'), 0, 0, 100, 'p3')),
        'oklch(42.385573698438975% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 2, 'wcag', 'lighter'), 0, 0, 100, 'p3')),
        'oklch(77.24185578901267% 0 0)',
    )
})

// Mid gray fg
test('#19', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 2, 'wcag'), 0, 0, 100, 'p3')),
        'oklch(54.92121175453411% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 2, 'wcag', 'auto'), 0, 0, 100, 'p3')),
        'oklch(54.92121175453411% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 2, 'wcag', 'darker'), 0, 0, 100, 'p3')),
        'oklch(14.357948280402544% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#434343', 2, 'wcag', 'lighter'), 0, 0, 100, 'p3')),
        'oklch(54.92121175453411% 0 0)',
    )
})

// Mid gray fg, high contrast
test('#20', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 4, 'wcag'), 0, 0, 100, 'p3')),
        'oklch(23.957063394769854% 0 0)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 4, 'wcag', 'auto'), 0, 0, 100, 'p3')),
        'oklch(23.957063394769854% 0 0)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 4, 'wcag', 'darker'), 0, 0, 100, 'p3')),
        'oklch(23.957063394769854% 0 0)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('#7D7D7D', 4, 'wcag', 'lighter'), 0, 0, 100, 'p3')),
        'oklch(99.0383882727752% 0 0)',
    )
})

// Colored fg
test('#21', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('color(display-p3 0.439 0.945 0.647)', 5, 'wcag'), 0.14, 300, 100, 'p3')),
        'oklch(47.12061937608723% 0.14 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToFg('color(display-p3 0.439 0.945 0.647)', 5, 'wcag', 'auto'), 0.14, 300, 100, 'p3'),
        ),
        'oklch(47.12061937608723% 0.14 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToFg('color(display-p3 0.439 0.945 0.647)', 5, 'wcag', 'darker'), 0.14, 300, 100, 'p3'),
        ),
        'oklch(47.12061937608723% 0.14 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToFg('color(display-p3 0.439 0.945 0.647)', 5, 'wcag', 'lighter'), 0.14, 300, 100, 'p3'),
        ),
        'oklch(100% 0.14 300)',
    )
})

// Colored dark fg
test('#22', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToFg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag'), 0.2, 120, 100, 'p3')),
        'oklch(84.20655667477361% 0.2 120)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToFg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag', 'auto'), 0.2, 120, 100, 'p3'),
        ),
        'oklch(84.20655667477361% 0.2 120)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToFg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag', 'darker'), 0.2, 120, 100, 'p3'),
        ),
        'oklch(0% 0.2 120)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(
            apcach(crToFg('color(display-p3 0.369 0.255 0.573)', 5, 'wcag', 'lighter'), 0.2, 120, 100, 'p3'),
        ),
        'oklch(84.20655667477361% 0.2 120)',
    )
})

// High contrast
test('#23', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag'), 0.4, 150, 100, 'p3')),
        'oklch(51.367187164754405% 0.4 150)',
    )
})

// White bg, maxChroma
test('#24', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag'), maxChroma(), 200, 100, 'p3')),
        'oklch(52.343749658380915% 0.11875000000000004 200)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag', 'auto'), maxChroma(), 200, 100, 'p3')),
        'oklch(52.343749658380915% 0.11875000000000004 200)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag', 'darker'), maxChroma(), 200, 100, 'p3')),
        'oklch(52.343749658380915% 0.11875000000000004 200)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('white', 5, 'wcag', 'lighter'), maxChroma(), 200, 100, 'p3')),
        'oklch(100% 0 200)',
    )
})

// White bg, maxChroma capped
test('#25', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag'), maxChroma(0.1), 100, 100, 'p3')),
        'oklch(58.3984375% 0.1 100)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag', 'auto'), maxChroma(0.1), 100, 100, 'p3')),
        'oklch(58.3984375% 0.1 100)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag', 'darker'), maxChroma(0.1), 100, 100, 'p3')),
        'oklch(0% 0 100)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('black', 5, 'wcag', 'lighter'), maxChroma(0.1), 100, 100, 'p3')),
        'oklch(58.3984375% 0.1 100)',
    )
})

// Almost too high contrast, maxChroma
test('#26', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 4, 'wcag'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(39.742747721748046% 0.2 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 4, 'wcag', 'auto'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(39.742747721748046% 0.2 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 4, 'wcag', 'darker'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(39.742747721748046% 0.2 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 4, 'wcag', 'lighter'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(100% 0 300)',
    )
})

// Too high contrast, maxChroma
test('#27', () => {
    // Implicit search direction
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 9, 'wcag'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(0% 0 300)',
    )

    // AUTO
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 9, 'wcag', 'auto'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(0% 0 300)',
    )

    // DARKER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 9, 'wcag', 'darker'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(0% 0 300)',
    )

    // LIGHTER
    _assertSimilarOklch(
        apcachToCss(apcach(crToBg('#A1A1A1', 9, 'wcag', 'lighter'), maxChroma(0.2), 300, 100, 'p3')),
        'oklch(100% 0 300)',
    )
})

// ----------------------------------------
// RESTORATION
// ----------------------------------------

/*
// Test #27. Restoring
testCases.push({
  caclulatedResult: apcachToCss(
    cssToApcach("rgb(255, 255, 255)", {
      bg: "rgb(75, 75, 75)",
    })
  ),
  expectedResult: "oklch(100% 0 0)",
});

// Test #28. Restoring
// TODO: finish it
testCases.push({
  caclulatedResult: apcachToCss(
    cssToApcach("rgb(255, 255, 255)", {
      bg: "rgb(89, 137, 105)",
    })
  ),
  expectedResult: "oklch(100% 0 0)",
});
*/
