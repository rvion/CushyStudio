import { spawn } from 'child_process'
import os from 'os'

export async function transpileCode(filePath: AbsolutePath): Promise<string> {
    // Attempt to start esbuild from node_modules/.bin/esbuild
    const isWindows = os.platform() === 'win32'
    let esbuildPath: string
    let command: string
    let args: string[]
    if (isWindows) {
        esbuildPath = `./node_modules/esbuild/bin/esbuild`
        command = 'node'
        args = [esbuildPath, '--bundle', filePath]
    } else {
        esbuildPath = `./node_modules/.bin/esbuild`
        command = esbuildPath
        args = ['--bundle', filePath]
    }

    const result = await new Promise<string>((resolve, reject) => {
        const esbuildProcess = spawn(command, args)
        let output = ''

        esbuildProcess.stdout.on('data', (data) => {
            output += data
        })

        esbuildProcess.stderr.on('data', (data) => {
            console.log('[🌭] transpile error data:', data.toString())
        })

        esbuildProcess.on('error', (err) => {
            console.log('[🌭] transpile error', err)
            reject(err)
        })

        esbuildProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`esbuild process exited with code ${code}`))
            } else {
                resolve(output)
            }
        })
    })

    return result
}
