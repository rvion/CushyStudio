// @ts-nocheck
import sharp from 'sharp'

async function addOutlineToImage(inputPath: string, outputPath: string) {
    // Convert the image to a binary mask
    const mask = await sharp(inputPath)
        .threshold() // This will turn the image into a black & white mask
        .toBuffer()

    // Dilate the mask (i.e., expand the white parts)
    const dilated = await sharp(mask).morphology({ kernel: 'octagon', width: 3, height: 3, scale: 1 }).toBuffer()

    // Create the outline by subtracting the original mask from the dilated mask
    const outline = await sharp(dilated)
        .composite([
            {
                input: mask,
                blend: 'dest-out', // This subtracts the original mask from the dilated one
            },
        ])
        .toBuffer()

    // Composite this outline with the original image
    await sharp(inputPath)
        .composite([
            {
                input: outline,
                blend: 'over',
            },
        ])
        .toFile(outputPath)
}

// Usage
addOutlineToImage('./assets/openpose/test-2.png', './x-outline.png').catch((err) => {
    console.error('Failed to process the image:', err)
})
