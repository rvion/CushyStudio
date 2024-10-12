export const samplePrompts = {
    tree: [
        //
        'masterpiece, tree',
        '?color, ?3d_term, ?adj_beauty, ?adj_general',
        '(nature:0.9), (intricate_details:1.1)',
    ].join('\n'),
}

export const sampleNegative = {
    simpleNegativeNsfw: [
        //
        'bad quality, blurry, low resolution, pixelated, noisy',
        'nsft, nsfw, adult, young, naked, nude',
    ].join('\n'),
    simpleNegative: [
        //
        'bad quality, blurry, low resolution, pixelated, noisy',
    ].join('\n'),
}
