const { spawn } = require('child_process')
const path = require('path')
const os = require('os')

// ensure tsconfig.custom.json exists
const fs = require('fs')
const tsconfigPath = path.join(__dirname, 'tsconfig.custom.json')
if (!fs.existsSync(tsconfigPath)) {
    const defaultTsconfigJSON = { include: ['src', 'schema/global.d.ts'], exclude: [] }
    fs.writeFileSync(tsconfigPath, JSON.stringify(defaultTsconfigJSON, null, 4))
}

// cross platform run command
const runCommand = (command, args) => {
    const cmd = os.platform() === 'win32' ? `${command}.cmd` : command
    const cmdPath = path.join('.', 'node_modules', '.bin', cmd)
    const spawnedProcess = spawn(cmdPath, args, { shell: true, stdio: 'inherit' })

    spawnedProcess.on('error', (err) => {
        console.error(`Error starting process: ${cmdPath}`, err)
        process.exit(1)
    })

    return spawnedProcess
}
console.log('Starting vite...')
const vite = runCommand('vite', ['dev'])

console.log('Starting electron...')
const electron = runCommand('electron', ['-i', 'src/shell'])

const cleanup = () => {
    console.log('Killing processes...')
    vite.kill()
    electron.kill()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

vite.on('close', cleanup)
electron.on('close', cleanup)
