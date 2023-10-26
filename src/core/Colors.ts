export const comfyColors: { [category: string]: string } = {
    loaders: '#446011',
    latent: '#464689',
    'latent/transform': '#464689',
    conditioning: '#481413', // '#0d430d',
    'conditioning/style_model': '#0d430d',
    sampling: '#634a1b',
    image: '#7e3a3a',
}

export const getColor = (_category: string) => {
    const category = _category.toLowerCase()
    if (category in comfyColors) {
        return comfyColors[category]
    }
    return '#000000'
}
