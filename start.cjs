const { spawn } = require('child_process')
const path = require('path')
const os = require('os')

// Ensure tsconfig.custom.json exists
const fs = require('fs')
const tsconfigPath = path.join(__dirname, 'tsconfig.custom.json')
if (!fs.existsSync(tsconfigPath)) {
    const defaultTsconfigJSON = { include: ['src', 'schema/global.d.ts'], exclude: [] }
    fs.writeFileSync(tsconfigPath, JSON.stringify(defaultTsconfigJSON, null, 4))
}

// Cross-platform run command
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

const cleanup = (source) => {
    console.log(`Killing processes from ${source}...`)
    vite.kill('SIGKILL')
    electron.kill()

    // Forcefully terminate if not closed within a timeout
    forceKill(vite, 1000) // Timeout in milliseconds
    forceKill(electron, 1000)
}

// Customized forceful kill for stubborn processes
const forceKill = (process, timeout = 5000) => {
    const checkInterval = 100
    let elapsed = 0

    const interval = setInterval(() => {
        if (process.killed) {
            clearInterval(interval)
        } else if (elapsed > timeout) {
            console.warn(`Forcefully terminating process after ${timeout}ms`)
            process.kill('SIGKILL')
            clearInterval(interval)
        } else {
            elapsed += checkInterval
        }
    }, checkInterval)
}

// ... [Your existing code for process handling]

// Additional Windows-specific signal handling
if (os.platform() === 'win32') {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    rl.on('SIGINT', function () {
        process.emit('SIGINT')
    })
}

process.on('SIGINT', () => cleanup('SIGINT'))
process.on('SIGTERM', () => cleanup('SIGTERM'))
electron.on('close', () => cleanup('Electron'))
