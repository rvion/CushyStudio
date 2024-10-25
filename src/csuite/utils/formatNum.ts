/**
 * insert space ever 3-digits to make long numbers easier to read
 */
export const formatNum = (size: number): string => {
   return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
