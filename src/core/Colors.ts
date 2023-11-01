// PALETTE -------------------------------------------------------------------
export const palette = {
    primitive: '#554c32',
    loader: '#446011',
    latent: '#464689',
    conditioning: '#481413',
    sampl: '#634a1b',
    image: '#7e3a3a',
}
export const paletteKeys = Object.keys(palette) as (keyof typeof palette)[]

// CATEGORIES ----------------------------------------------------------------
export const comfyColors: { [category: string]: string } = {
    loaders: palette.loader,
    latent: palette.latent,
    'latent/transform': palette.latent,
    conditioning: palette.conditioning, // '#0d430d',
    'conditioning/style_model': palette.conditioning,
    sampling: palette.sampl,
    image: palette.image,
    primitive: palette.primitive,
}

export const getColorForCategory = (_category: string) => {
    const category = _category.toLowerCase()
    if (category in comfyColors) {
        return comfyColors[category]
    }
    return 'black'
}

// INPUT ----------------------------------------------------------------
export const getColorForInputNameInComfy = (nameInComfy: string) => {
    const name = nameInComfy.toLowerCase()
    if (name.includes('width')) return palette.primitive
    if (name.includes('height')) return palette.primitive
    for (const k of paletteKeys) {
        if (name.startsWith(k)) return palette[k]
    }
    return 'black'
}

// OUTPUTS ----------------------------------------------------------------
export const getColorForOutputNameInCushy = (nameInComfy: string) => {
    const name = nameInComfy.toLowerCase()
    if (name in nameColors) {
        return comfyColors[name]
    }
    return 'black'
}

export const nameColors = {
    latent: 'blue',
}
