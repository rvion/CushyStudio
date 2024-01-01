const { exec } = require('child_process')
const os = require('os')
const { cwd } = require('process')

// Determine the OS and dispatch the appropriate script
const platform = os.platform()
if (platform === 'win32') {
    executeShellScript('./_windows-update.bat')
} else if (platform === 'linux') {
    executeShellScript('./_mac-linux-update.sh')
} else if (platform === 'darwin') {
    executeShellScript('./_mac-linux-update.sh')
} else {
    throw new Error(`Unsupported platform: ${platform}`)
}

function executeShellScript(scriptPath) {
    const dir = cwd()
    console.log(`[🛋️] cwd:`, dir)
    const child = exec(scriptPath, { cwd: dir }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution error: ${error}`)
            return
        }
        console.log(stdout)
        console.error(stderr)
    })

    // Forwarding stdin, stdout, and stderr
    process.stdin.pipe(child.stdin)
    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)
}
