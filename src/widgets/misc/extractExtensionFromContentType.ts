export const extractExtensionFromContentType = (contentType: string): string => {
   if (contentType === `image/bmp`) return '.bmp'
   if (contentType === `image/gif`) return '.gif'
   if (contentType === `image/x-icon`) return '.ico'
   if (contentType === `image/jpeg`) return '.jpeg'
   if (contentType === `image/png`) return '.png'
   if (contentType === `image/svg+xml`) return '.svg'
   if (contentType === `image/tiff`) return '.tiff'
   if (contentType === `image/webp`) return '.webp'
   return ''
}

export const knownImageExtensions: string[] = ['.bmp', '.gif', '.ico', '.jpeg', '.png', '.svg', '.tiff', '.webp']
