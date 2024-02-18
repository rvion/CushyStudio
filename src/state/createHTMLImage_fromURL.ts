export const createHTMLImage_fromURL = (
    /** the same `src` value you would use in an <img /> html node */
    src: string,
): Promise<HTMLImageElement> => {
    return new Promise((yes, no) => {
        const img = new Image()
        img.loading = 'eager'
        img.onload = () => yes(img)
        img.onerror = no
        img.src = src
    })
}

export const createHTMLImage_fromURLNoAwait = (
    /** the same `src` value you would use in an <img /> html node */
    src: string,
): HTMLImageElement => {
    const img = new Image()
    img.loading = 'eager'
    // img.onload = () => yes(img)
    // img.onerror = no
    img.src = src
    return img
}
