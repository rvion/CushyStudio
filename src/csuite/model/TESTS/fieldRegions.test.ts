import { describe, expect, it } from 'bun:test'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

// Define the directory where the `Field<...>.ts` or `.tsx` files are located
const directoryPath: "src/csuite" = 'src/csuite' // Change this to your directory path

// Define the list of required regions in order
const requiredRegions: string[] = [
   '$Config', // config type
   '$Serial', // serial type
   '$Value',
   '$Types',
   'State',
   'Static',
   'Ctor',
   'UI',
   'Serial',
   'Children',
   'Value',
   'Changes',
   'Problems',
   'Nullability',
   'Setters',
   'Mock',
]

// Helper function to extract found regions in order
const extractRegionsInOrder = (fileContent: string, regions: string[]): string[] => {
   const foundRegions: string[] = []
   const currentIndex = 0

   // Extract entire line after `// #region` prefix
   const regionRegex = /\/\/\s*#region\s*(.*)/g

   let match
   while ((match = regionRegex.exec(fileContent)) !== null) {
      const regionText = match[1]!.trim()
      foundRegions.push(regionText)
   }

   return foundRegions
}

// Recursive function to find all `.ts` and `.tsx` files matching `Field<...>.<extension>`
const findFieldFiles = (dir: string): string[] => {
   let files: string[] = []

   for (const file of readdirSync(dir)) {
      const fullPath = join(dir, file)
      const fileStat = statSync(fullPath)

      if (fileStat.isDirectory()) {
         // Recursively search in subdirectory
         files = files.concat(findFieldFiles(fullPath))
      } else if (fileStat.isFile() && /^Field[A-Za-z0-9]+\.(ts|tsx)$/.test(file)) {
         files.push(fullPath)
      }
   }

   return files
}

describe.skip('Field<...>.ts/.tsx files region check', () => {
   // Recursively find all `.ts` and `.tsx` files that match `Field<...>.<extension>`
   const files: string[] = findFieldFiles(directoryPath)

   // files.forEach((file) => {
   //     it(`should contain all required regions in order for ${file}`, () => {
   //         const fileContent = readFileSync(file, 'utf8')

   //         // Extract found regions in order from file content
   //         const foundRegions: string[] = extractRegionsInOrder(fileContent, requiredRegions)

   //         // Compare found regions to the expected required regions
   //         expect([file, ...foundRegions]).toEqual([file, ...requiredRegions])
   //     })
   // })
})
