const { exec } = require('child_process')
const os = require('os')
const { cwd } = require('process')

// Function to execute the shell script
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

// Determine the OS and dispatch the appropriate script
const platform = os.platform()
if (platform === 'win32') {
    executeShellScript('./_windows_INSTALL.bat')
} else if (platform === 'linux') {
    // Other OS (like Linux or macOS) - execute .sh script
    executeShellScript('./_macos_INSTALL.sh')
} else if (platform === 'darwin') {
    executeShellScript('./_macos_INSTALL.sh')
} else {
}
