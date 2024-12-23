/**
 * alias to JSON.stringify(<x>, null, 4),
 * without having to add [null, 4] at the end of the object
 * which may be annoying to do and annoying to read when prettyPrinting
 * large objects
 */
export const prettyPrint = (x: unknown): string => {
   return JSON.stringify(x, null, 4)
}
