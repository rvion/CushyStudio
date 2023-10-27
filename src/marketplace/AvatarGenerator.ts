export function generateAvatar(hash: string): string {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('Failed to get 2D context.')
    }

    // Convert hash into an array of integer values for color and design purposes
    const values = hash.split('').map((char) => char.charCodeAt(0))

    // Set background color
    ctx.fillStyle = `rgb(${values[0] % 255}, ${values[1] % 255}, ${values[2] % 255})`
    ctx.fillRect(0, 0, 64, 64)

    // Set design color (complementary to background for visibility)
    ctx.fillStyle = `rgb(${(values[0] + 128) % 255}, ${(values[1] + 128) % 255}, ${(values[2] + 128) % 255})`

    // Draw a symmetrical design based on hash values
    for (let i = 0; i < values.length && i < 16; i += 2) {
        // Limiting to 8 squares on the left half for symmetry
        const x = (values[i] % 4) * 8 // Only use the left half (32 pixels)
        const y = (values[i + 1] % 8) * 8
        ctx.fillRect(x, y, 8, 8) // Draw on the left side
        ctx.fillRect(64 - x - 8, y, 8, 8) // Mirror and draw on the right side
    }

    return canvas.toDataURL()
}

export function generateAvatar_old(hash: string): string {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('Failed to get 2D context.')
    }

    // Convert hash into an array of integer values for color and design purposes
    const values = hash.split('').map((char) => char.charCodeAt(0))

    // Set background color
    ctx.fillStyle = `rgb(${values[0] % 255}, ${values[1] % 255}, ${values[2] % 255})`
    ctx.fillRect(0, 0, 64, 64)

    // Set design color (complementary to background for visibility)
    ctx.fillStyle = `rgb(${(values[0] + 128) % 255}, ${(values[1] + 128) % 255}, ${(values[2] + 128) % 255})`

    // Draw design based on hash values
    for (let i = 0; i < values.length; i += 2) {
        const x = (values[i] % 8) * 8
        const y = (values[i + 1] % 8) * 8
        ctx.fillRect(x, y, 8, 8)
    }

    return canvas.toDataURL()
}

const hash = 'example' // You can replace this with any short
