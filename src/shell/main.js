const { mkdirSync } = require('fs')

START()

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

async function START() {
    const mode = process.env['CUSHY_RUN_MODE']
    if (mode == null) throw new Error('CUSHY_RUN_MODE is not defined')
    const allowedModes = ['dev', 'dist']
    if (!allowedModes.includes(mode)) {
        console.error(`CUSHY_RUN_MODE is not allowed: ${mode}`)
        process.exit(1)
    }

    const PORT = mode === 'dist' ? 8688 : 8788
    // ===//=====//======//======//======//======//======//======//======//======//======//======//==
    // ==//=====//======//======//======//======//======//======//======//======//======//======//===
    // 1. START VITE DEV SERVER

    // DIST MODE ------------------------------------------
    const express = require('express')
    if (mode === 'dist') {
        async function startDistServer() {
            const app = express()
            const path = require('path')

            // Directory paths for the two public folders
            app.use(express.static('release'))
            app.use(express.static('library'))
            app.use(express.static('public'))
            // Define a simple route for the home page
            app.get('/', (req, res) => {
                res.sendFile(path.join('release/index.html'))
            })
            // Start the server on port ${PORT}
            app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
        }
        startDistServer()
    }
    // DEV MODE ------------------------------------------
    else {
        const { createServer } = require('vite')
        async function startDevServer() {
            // Create a Vite development server
            const server = await createServer({
                // Pass any options you need for the server here
                // For example, to specify the root directory:
                // root: './path-to-your-root-directory'
            })
            server.middlewares.use(express.static('release'))
            server.middlewares.use(express.static('library'))
            server.middlewares.use(express.static('public'))
            // Start the server
            await server.listen()

            server.printUrls()
        }
        startDevServer().catch((error) => {
            console.error(error)
            process.exit(1)
        })
    }

    // ===//=====//======//======//======//======//======//======//======//======//======//======//==
    // ==//=====//======//======//======//======//======//======//======//======//======//======//===

    // ⏸️ try {
    // ⏸️     const patchElectronIconAndName = require('./patch.js').default
    // ⏸️     patchElectronIconAndName()
    // ⏸️ } catch (error) {
    // ⏸️     console.log('❌ error patching electron icon and name', error)
    // ⏸️ }

    const { app, BrowserWindow, globalShortcut, ipcMain, session } = require('electron')

    ipcMain.on('resize-for-video-capture', (event, arg) => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) focusedWindow.setSize(1920, 1080)
    })

    ipcMain.on('search-stop', (event, arg) => {
        console.log(`[🔎] search-stop received with arg:`, arg)
        webContents.stopFindInPage('clearSelection')
    })
    ipcMain.on('search-start', (event, arg, options) => {
        console.log(`[🔎] search-start received with query:`, arg, options)
        if (arg.length < 2) return
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow == null) return console.log(`[🔎] ❌ no focusedWindow`)
        const webContents = focusedWindow.webContents
        webContents.findInPage(arg, options)
    })
    ipcMain.on('resize-for-laptop', (event, arg) => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) focusedWindow.setSize(1280, 720)
    })
    ipcMain.on('toggle-devtools', (event, arg) => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
    })
    ipcMain.on('open-devtools', (event, arg) => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) focusedWindow.webContents.openDevTools()
    })
    ipcMain.on('close-devtools', (event, arg) => {
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (focusedWindow) focusedWindow.webContents.closeDevTools()
    })

    // required to interract with ComfyUI
    // | https://github.com/electron/electron/issues/18940
    // | https://gist.github.com/nornagon/ff2f8ab8d1ef1ddcc394de1e892015ad
    app.commandLine.appendSwitch('disable-site-isolation-trials')

    // update dock icon and text
    const nativeImage = require('electron').nativeImage
    const image = nativeImage.createFromPath('src/public/CushyLogo.png')
    // const image = nativeImage.createFromPath('src/public/CushyLogo-512.icns')

    // ❌ cause a bug for warloardruby (sent on matrix):
    // ❌ cannot read property 'setIon' of undefined
    // app.dock.setIcon(image)

    // ❌ makes an ugly label in the osx dock
    // app.dock.setBadge('🛋️ CushySudio')

    async function createWindow() {
        const mainWindow = new BrowserWindow({
            icon: image,
            title: '🛋️ CushySudio',
            //
            // width: 800,
            // height: 600,
            webPreferences: {
                plugins: true,
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                nodeIntegrationInSubFrames: false,
                contextIsolation: false,
                backgroundThrottling: false,
                webviewTag: true,
                webSecurity: false, // Disable CORS
                allowRunningInsecureContent: true, // Disable CORS
            },
        })

        mainWindow.webContents.on('found-in-page', function (event, result) {
            if (result.finalUpdate) {
                mainWindow.webContents.send('search-result', result)
                // console.log(`[🤠] final update. result =`, result)
            }
        })
        // ------------------------------------------------------------
        // https://github.com/electron/electron/pull/573
        //remove X-Frame-Options headers on all incoming requests.
        mainWindow.webContents.session.webRequest.onHeadersReceived({ urls: ['*://*/*'] }, (details, callback) => {
            if (details && details.responseHeaders) {
                if (details.responseHeaders['X-Frame-Options']) {
                    delete details.responseHeaders['X-Frame-Options']
                } else if (details.responseHeaders['x-frame-options']) {
                    delete details.responseHeaders['x-frame-options']
                }
            }
            callback({ cancel: false, responseHeaders: details.responseHeaders })
        })

        // ------------------------------------------------------------
        mainWindow.maximize()
        mkdirSync('outputs/_downloads', { recursive: true })
        // https://www.electronjs.org/docs/latest/api/download-item
        // https://www.electronjs.org/docs/latest/api/download-item#class-downloaditem

        const pathe = require('pathe')
        mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
            const originalFileName = item.getFilename()
            const finalFileName = `${Date.now()}-${originalFileName}`
            const relativePath = `outputs/_downloads/${finalFileName}`

            // Set the save path, making Electron not to prompt a save dialog.
            item.setSavePath(relativePath)

            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    console.log('Download is interrupted but can be resumed')
                } else if (state === 'progressing') {
                    if (item.isPaused()) {
                        console.log('Download is paused')
                    } else {
                        console.log(`Received bytes: ${item.getReceivedBytes()}`)
                    }
                }
            })
            item.once('done', (event, state) => {
                if (state === 'completed') {
                    console.log('Download successfully')
                    mainWindow.webContents.send('filedownloaded', {
                        fileName: finalFileName,
                        originalFilename: originalFileName,
                        relativePath: relativePath,
                        absolutePath: pathe.resolve(relativePath),
                    })
                } else {
                    console.log(`Download failed: ${state}`)
                }
            })
        })

        // Open DevTools automatically
        if (mode === 'dev') {
            mainWindow.webContents.openDevTools()
        }

        // check if cushy is running
        let serverStarted = false
        const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))
        let retryCount = 0
        do {
            console.log('waiting for cushy to start')
            retryCount++
            try {
                res = await fetch(`http://localhost:${PORT}`) //
                    .catch((err) => fetch(`http://127.0.0.1:${PORT}`))

                if (res.status !== 200) {
                    console.log(`[VITE] vite not yet started (status:: ${res.status})`)
                    await sleep(1000)
                } else {
                    console.log(`[VITE] vite started`)
                    serverStarted = true
                }
            } catch (error) {
                if (retryCount > 100) console.log('❌ error:', error)
                await sleep(100)
            }
        } while (!serverStarted)

        // load cushy
        mainWindow.loadURL(`http://localhost:${PORT}`, { extraHeaders: 'pragma: no-cache\n' }) // Load your localhost URL

        // Open DevTools (optional)
        // mainWindow.webContents.openDevTools();
    }

    app.whenReady().then(() => {
        session.defaultSession.clearStorageData(null, (error) => {
            if (error) console.log(error)
            // in our case we need to restart the application
            // app.relaunch();
            // app.exit();
        })

        createWindow()
        app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    })

    app.on('window-all-closed', function () {
        console.log('window-all-closed')
        app.quit()
        // if (process.platform !== 'darwin')
    })

    app.on('ready', () => {
        // globalShortcut.unregisterAll()
        app.on('browser-window-focus', () => {
            globalShortcut.unregisterAll()
            // globalShortcut.registerAll(['CommandOrControl+W'], () => {
            //     return
            // })
        })
        app.on('browser-window-blur', () => {
            globalShortcut.unregisterAll()
        })
        // globalShortcut.register('CommandOrControl+W', () => {
        //     //stuff here
        //     console.log('CommandOrControl+W')
        // })
    })
}
