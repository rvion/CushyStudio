export const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16)
export const randomColorHsv = () => {
    const h = Math.floor(Math.random() * 360)
    const s = Math.floor(Math.random() * 100)
    const v = Math.floor(Math.random() * 100)
    return `hsv(${h},${s}%,${v}%)`
}
export const randomNiceColor = (seed: string = '') => {
    const seedNumb = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    // prettier-ignore
    const cols = [
        '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0',
        '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8',
        '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080',
        // '#ffffff', // '#000000',
    ]
    return cols[seedNumb % cols.length]
}

export const randomColorHSLNice = (seed: string) => {
    // prettier-ignore
    const seedNumb
        = seed === 'IMAGE' ? 12
        : seed === 'CONDITIONING' ? 180
        : seed === 'MODEL' ? 200
        : seed === 'CLIP' ? 40
        : seed === 'VAE' ? 80
        : [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const h = seedNumb % 360
    const s = 100
    const l = 50
    return `hsl(${h},${s}%,${l}%)`
}

const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
    const c = v * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = v - c
    let r = 0
    let g = 0
    let b = 0
    if (h < 60) {
        r = c
        g = x
    } else if (h < 120) {
        r = x
        g = c
    } else if (h < 180) {
        g = c
        b = x
    } else if (h < 240) {
        g = x
        b = c
    } else if (h < 300) {
        r = x
        b = c
    } else {
        r = c
        b = x
    }
    return [Math.floor((r + m) * 255), Math.floor((g + m) * 255), Math.floor((b + m) * 255)]
}
