const { exec } = require('child_process')
const os = require('os')
const { cwd } = require('process')

const mode = process.env['CUSHY_RUN_MODE']
if (mode == null) throw new Error('CUSHY_RUN_MODE is not defined')
const allowedModes = ['dev', 'dist']
if (!allowedModes.includes(mode)) {
   console.error(`CUSHY_RUN_MODE is not allowed: ${mode}`)
   process.exit(1)
}

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
   if (mode === 'dev') executeShellScript('./_windows-start-dev.bat')
   else executeShellScript('./_windows-start.bat')
} else if (platform === 'linux') {
   // Other OS (like Linux or macOS) - execute .sh script
   if (mode === 'dev') executeShellScript('./_mac-linux-start-dev.sh')
   else executeShellScript('./_mac-linux-start.sh')
} else if (platform === 'darwin') {
   if (mode === 'dev') executeShellScript('./_mac-linux-start-dev.sh')
   else executeShellScript('./_mac-linux-start.sh')
} else {
   throw new Error(`Unsupported platform: ${platform}`)
}
