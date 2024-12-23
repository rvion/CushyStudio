// see https://stackoverflow.com/a/37511463
export function unaccent(text: string): string {
   return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function normalizeText(text: string): string {
   return unaccent(text.toLowerCase())
}

export function searchMatches(haystack: string, needle: string): boolean {
   return normalizeText(haystack).includes(normalizeText(needle))
}
