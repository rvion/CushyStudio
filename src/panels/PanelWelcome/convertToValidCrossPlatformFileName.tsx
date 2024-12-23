/**
 * convert any name (possibly with space or other invalid character )
 * to some valid file name on all major OS
 */

export const convertToValidCrossPlatformFileName = (s: string): string => {
   return s
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-/g, '')
      .replace(/-$/g, '')
}
