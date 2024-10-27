// PALETTE -------------------------------------------------------------------
export const palette = {
   primitive: 'var(--comfy-primitive)',
   loader: 'var(--comfy-loader)',
   latent: 'var(--comfy-latent)',
   conditioning: 'var(--comfy-conditioning)',
   sampl: 'var(--comfy-sampl)',
   image: 'var(--comfy-image)',
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

export const getColorForCategory = (_category: string): string | undefined => {
   const category = _category.toLowerCase()
   if (category in comfyColors) return comfyColors[category]
   return 'var(--comfy-default)'
}

// INPUT ----------------------------------------------------------------
export const getColorForInputNameInComfy = (nameInComfy: string): string | undefined => {
   const name = nameInComfy.toLowerCase()
   if (name.includes('width')) return palette.primitive
   if (name.includes('height')) return palette.primitive
   for (const k of paletteKeys) if (name.startsWith(k)) return palette[k]
   return 'var(--comfy-default)'
}

// OUTPUTS ----------------------------------------------------------------
export const getColorForOutputNameInCushy = (nameInComfy: string): string | undefined => {
   const name = nameInComfy.toLowerCase()
   if (name in nameColors) return comfyColors[name]
   return 'var(--comfy-default)'
}

export const nameColors = {
   latent: 'blue',
}
