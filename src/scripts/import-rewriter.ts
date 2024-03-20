// run that with bun
import fs from 'fs'
import path from 'path'

const srcFolder = './src'

function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf8')
    const modifiedContent = content.replace(/import\s+{([^}]+)}\s+from\s+'src\/([^']+)'/g, (match, imports, relativePath) => {
        const currentDir = path.dirname(filePath)
        const absoluteImportPath = path.join(srcFolder, relativePath)
        let relativeImportPath = path.relative(currentDir, absoluteImportPath)

        // Add './' prefix if the import is in the same folder
        if (!relativeImportPath.startsWith('.')) {
            relativeImportPath = `./${relativeImportPath}`
        }

        return `import {${imports}} from '${relativeImportPath}'`
    })
    fs.writeFileSync(filePath, modifiedContent, 'utf8')
}

function traverseDirectory(directoryPath: string) {
    const files = fs.readdirSync(directoryPath)
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
            traverseDirectory(filePath)
        } else if (stats.isFile() && path.extname(filePath) === '.ts') {
            processFile(filePath)
        }
    })
}

traverseDirectory(srcFolder)
