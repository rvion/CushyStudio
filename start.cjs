const { spawn } = require('child_process')

const runCommand = (command, args) => {
    const spawnedProcess = spawn(command, args, { shell: true, stdio: 'inherit' })

    spawnedProcess.on('error', (err) => {
        console.error(`Error starting process: ${command}`, err)
        process.exit(1)
    })

    return spawnedProcess
}

console.log('Starting vite...')
const vite = runCommand('./node_modules/.bin/vite', ['dev'])

console.log('Starting electron...')
const electron = runCommand('./node_modules/.bin/electron', ['-i', 'src/shell'])

const cleanup = () => {
    console.log('Killing processes...')
    vite.kill()
    electron.kill()
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

vite.on('close', cleanup)
electron.on('close', cleanup)
