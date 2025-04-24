/**
 *
 * UUID Encoder using CJK Unified Ideographs
 * Encodes UUIDs into short strings (10 characters) using CJK characters
 *
 * - A clean, encapsulated class design
 * - Support for saving/loading the alphabet for consistency across sessions
 * - Built-in statistics and informative logging
 * - Error handling for decoding
 * - Support for limiting the alphabet size (defaulting to 13,000 characters as discussed)
 * - Comments explaining the functionality
 * - Example usage (commented out for easy removal)
 * - TypeScript type annotations for better IDE support
 *
 * (💬 2025-04-01 rvion: copy pasta from some recent chagpt poc)
 */
export class CjkUuidEncoder {
   private readonly alphabet: string

   /**
    * Creates a new CJK UUID encoder
    * @param maxChars Optional limit on the number of characters to use (default: 13000)
    */
   constructor(maxChars: number = 13000) {
      this.alphabet = this.generateCJKAlphabet(maxChars)
      console.log(`CJK UUID Encoder initialized with ${this.alphabet.length} characters`)
      console.log(`Theoretical bits per character: ${Math.log2(this.alphabet.length).toFixed(2)}`)
      console.log(`Expected UUID length: ${Math.ceil(128 / Math.log2(this.alphabet.length))} characters`)
   }

   /**
    * Generates an alphabet using CJK Unified Ideographs
    */
   private generateCJKAlphabet(maxSize: number): string {
      // CJK Unified Ideographs range (U+4E00 to U+9FFF)
      const start = 0x4e00
      const end = 0x9fff

      let alphabet = ''

      for (let code = start; code <= end && alphabet.length < maxSize; code++) {
         try {
            const char = String.fromCodePoint(code)
            alphabet += char
         } catch (e) {
            // Skip invalid code points
         }
      }

      return alphabet
   }

   /**
    * Encodes a UUID to a short string using CJK characters
    * @param uuid Standard UUID string (with or without hyphens)
    * @returns Encoded string using CJK characters
    */
   public encode(uuid: string): string {
      // Remove hyphens from UUID
      uuid = uuid.replace(/-/g, '')

      // Convert UUID (hexadecimal) to decimal
      const decimal = BigInt(`0x${uuid}`)

      // Handle special case of zero
      if (decimal === 0n) {
         return this.alphabet[0]!
      }

      // Convert to CJK encoding
      let encoded = ''
      const base = BigInt(this.alphabet.length)
      let value = decimal

      while (value > 0n) {
         const remainder = Number(value % base)
         encoded = this.alphabet[remainder] + encoded
         value = value / base
      }

      return encoded
   }

   /**
    * Decodes a CJK-encoded string back to a UUID
    * @param encoded CJK-encoded string
    * @returns Standard UUID with hyphens
    */
   public decode(encoded: string): string {
      if (encoded.length === 0) {
         throw new Error('Empty string cannot be decoded')
      }

      // Convert from CJK encoding to decimal
      let decimal = 0n
      const base = BigInt(this.alphabet.length)

      for (let i = 0; i < encoded.length; i++) {
         const char = encoded[i]!
         const index = this.alphabet.indexOf(char)
         if (index === -1) {
            throw new Error(`Character '${char}' not found in the alphabet`)
         }
         decimal = decimal * base + BigInt(index)
      }

      // Convert decimal to hexadecimal (UUID format without hyphens)
      let hex = decimal.toString(16)

      // Pad with leading zeros if necessary
      while (hex.length < 32) {
         hex = '0' + hex
      }

      // Insert hyphens to format as UUID
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
   }

   /**
    * Saves the current alphabet to a file for future reference
    * @param filename Path to save the alphabet file
    */
   public saveAlphabet(filename: string): void {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs')
      fs.writeFileSync(filename, this.alphabet, 'utf8')
      console.log(`Alphabet saved to ${filename}`)
   }

   /**
    * Loads an alphabet from a file
    * @param filename Path to the alphabet file
    */
   public static fromFile(filename: string): CjkUuidEncoder {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs')
      const encoder = new CjkUuidEncoder(0) // Create with empty alphabet
      // @ts-ignore - Override the readonly alphabet
      encoder.alphabet = fs.readFileSync(filename, 'utf8')
      console.log(`Loaded alphabet with ${encoder.alphabet.length} characters from ${filename}`)
      return encoder
   }

   /**
    * Returns statistics about the current encoder
    */
   public getStats(): { alphabetSize: number; bitsPerChar: number; expectedUuidLength: number } {
      const bitsPerChar = Math.log2(this.alphabet.length)
      return {
         alphabetSize: this.alphabet.length,
         bitsPerChar: bitsPerChar,
         expectedUuidLength: Math.ceil(128 / bitsPerChar),
      }
   }

   // Example usage:
   static example = (): void => {
      const encoder = new CjkUuidEncoder()

      // Encode a UUID
      const uuid = '123e4567-e89b-12d3-a456-426614174000'
      const encoded = encoder.encode(uuid)
      console.log(`Original UUID: ${uuid}`)
      console.log(`Encoded (${encoded.length} chars): ${encoded}`)
      console.log(`Decoded  back: ${encoder.decode(encoded)}`)

      // Save the alphabet for consistency
      encoder.saveAlphabet('cjk-uuid-alphabet.txt')

      // Later, load the same alphabet
      const sameEncoder = CjkUuidEncoder.fromFile('cjk-uuid-alphabet.txt')

      // Batch process multiple UUIDs
      const uuids = [
         '550e8400-e29b-41d4-a716-446655440000',
         'f47ac10b-58cc-4372-a567-0e02b2c3d479',
         '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      ]

      console.log('\nBatch encoding results:')
      uuids.forEach((uuid) => {
         const encoded = encoder.encode(uuid)
         console.log(`${uuid} → ${encoded} (${encoded.length} chars)`)
      })
   }
}

CjkUuidEncoder.example()
// example()
