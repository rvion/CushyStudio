// inspired from https://github.com/buildbreakdo/giticon

type Options = {
    background: [number, number, number, number]
    margin: number
    size: number
    saturation: number
    brightness: number
}

type Rect = {
    x: number
    y: number
    w: number
    h: number
    color: string
}

export function generateAvatar(
    //
    string: string = 'test',
    optionOverrides: Partial<Options> = {},
    mode: 'svg' | 'base64' = 'base64',
): string {
    const isEmptyString = typeof string !== 'string' || !string.length || string === '[deleted]'
    if (isEmptyString) {
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
            '<rect fill="#afb3b9" x="10" y="10" width="20" height="20" />' +
            '</svg>'
        )
    }

    const options = {
        // rgba
        background: [240, 240, 240, 0.2],
        margin: 0.05,
        size: 40,
        saturation: 0.7,
        brightness: 0.5,

        ...optionOverrides,
    }

    const hash = Math.abs(adler32(string)).toString().repeat(15)

    // HSL to RGB (hsl2rgb)
    //--------------------------------------------------------------------------
    const hue = parseInt(hash.substr(-7), 16) / 0xfffffff
    const colors = hsl2rgb(hue, options.saturation, options.brightness)

    const foregroundCssValue = `rgba(${colors.red}, ${colors.green}, ${colors.blue}, 1 )`
    const backgroundCssValue = 'rgba(' + options.background.join(',') + ')'

    const baseMargin = Math.floor(options.size * options.margin)
    const cell = Math.floor((options.size - baseMargin * 2) / 5)
    const margin = Math.floor((options.size - cell * 5) / 2)

    // the first 15 characters of the hash control the pixels (even/odd)
    // they are drawn down the middle first, then mirrored outwards
    let color
    let rectangles: Rect[] = []
    hash.split('').forEach((char, i) => {
        color = parseInt(hash.charAt(i), 16) % 2 ? backgroundCssValue : foregroundCssValue

        if (i < 5) {
            rectangles.push({
                x: 2 * cell + margin,
                y: i * cell + margin,
                w: cell,
                h: cell,
                color: color,
            })
        } else if (i < 10) {
            rectangles.push({
                x: 1 * cell + margin,
                y: (i - 5) * cell + margin,
                w: cell,
                h: cell,
                color: color,
            })
            rectangles.push({
                x: 3 * cell + margin,
                y: (i - 5) * cell + margin,
                w: cell,
                h: cell,
                color: color,
            })
        } else if (i < 15) {
            rectangles.push({
                x: 0 * cell + margin,
                y: (i - 10) * cell + margin,
                w: cell,
                h: cell,
                color: color,
            })
            rectangles.push({
                x: 4 * cell + margin,
                y: (i - 10) * cell + margin,
                w: cell,
                h: cell,
                color: color,
            })
        }
    })

    const rectanglesWithoutBackground = rectangles.filter((rect) => rect.color !== backgroundCssValue)

    const mostGraphicRectangleGroup =
        // If all rects are the color of the background
        // then the identicon is a square block; sometimes this has to be used
        rectanglesWithoutBackground.length ? rectanglesWithoutBackground : rectangles

    const draw = mostGraphicRectangleGroup
        .map((rect, i) => {
            // Start at point M(x,y)
            // Draw a (h)orizontal line of width
            // Then from that point draw a vertical line
            // Then from that point draw a horizontal line
            // Then from that point closePath draw a straight line from the current position, to the first point in the path.
            return `M${rect.x},${rect.y} h${rect.w} v${rect.h} h${0 - rect.h}z`
        })
        .join(' ')

    // Input:
    // <rect x="2" y="2" fill="#FFFFFF" width="2" height="2"/>
    // <rect x="2" y="6" fill="#FFFFFF" width="2" height="2"/>
    // <rect x="2" y="10" fill="#FFFFFF" width="2" height="2"/>
    // Paths:
    // <path fill="#fff" d="M2,2 h2 v2 h-2z"/>
    // <path fill="#fff" d="M2,6 h2 v2 h-2z"/>
    // <path fill="#fff" d="M2,10 h2 v2 h-2z"/>
    // Output:
    // <path fill="#fff" d="M2,2 h2 v2 h-2z M2,6 h2 v2 h-2z M2,10 h2 v2 h-2z"/>
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color: ${backgroundCssValue};" viewBox="0 0 40 40"><path shape-rendering="crispEdges" style="fill: ${foregroundCssValue}; stroke: ${foregroundCssValue}; stroke-width: ${1}; max-width: 100%; max-height: 100%;" d="${draw}" /></svg>`
    if (mode === 'svg') return svg
    return 'data:image/svg+xml;base64,' + btoa(svg)
}

function hsl2rgb(
    //
    h: number,
    s: number,
    b: number,
) {
    h *= 6
    const x = [(b += s *= b < 0.5 ? b : 1 - b), b - (h % 1) * s * 2, (b -= s *= 2), b, b + (h % 1) * s, b + s]

    return {
        red: Math.round(x[~~h % 6] * 255),
        green: Math.round(x[(h | 16) % 6] * 255),
        blue: Math.round(x[(h | 8) % 6] * 255),
    }
}

// ----------------------------------------------------------------------------------------
// adler32 is not cryptographically strong, and is only used to sanity check that
// markup generated on the server matches the markup generated on the client.
// This implementation (a modified version of the SheetJS version) has been optimized
// for our use case, at the expense of conforming to the adler32 specification
// for non-ascii inputs.
var MOD = 65521
function adler32(data: string): number {
    var a = 1
    var b = 0
    var i = 0
    var l = data.length
    var m = l & ~0x3
    while (i < m) {
        var n = Math.min(i + 4096, m)
        for (; i < n; i += 4) {
            b +=
                (a += data.charCodeAt(i)) +
                (a += data.charCodeAt(i + 1)) +
                (a += data.charCodeAt(i + 2)) +
                (a += data.charCodeAt(i + 3))
        }
        a %= MOD
        b %= MOD
    }
    for (; i < l; i++) {
        b += a += data.charCodeAt(i)
    }
    a %= MOD
    b %= MOD
    return a | (b << 16)
}
