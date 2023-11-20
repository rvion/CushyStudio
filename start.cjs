const { spawn } = require('child_process')
const path = require('path')
const os = require('os')

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
