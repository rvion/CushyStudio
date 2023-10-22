START()

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

async function START() {
    try {
        const patchElectronIconAndName = require('./patch.js').default
        patchElectronIconAndName()
    } catch (error) {
        console.log('❌ error patching electron icon and name', error)
    }

    const { app, BrowserWindow, globalShortcut } = require('electron')

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
            width: 800,
            height: 600,
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
        mainWindow.maximize()

        // Open DevTools automatically
        mainWindow.webContents.openDevTools()

        // check if cushy is running
        let viteStarted = false
        const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration))
        let retryCount = 0
        do {
            console.log('waiting for cushy to start')
            retryCount++
            try {
                res = await fetch('http://localhost:8788') //
                    .catch((err) => fetch('http://127.0.0.1:8788'))

                console.log(res.status)
                if (res.status !== 200) {
                    console.log(res.status)
                    await sleep(1000)
                } else viteStarted = true
            } catch (error) {
                if (retryCount > 10) console.log('❌ error:', error)
                await sleep(1000)
            }
        } while (!viteStarted)

        // load cushy
        mainWindow.loadURL('http://localhost:8788', { extraHeaders: 'pragma: no-cache\n' }) // Load your localhost URL

        // Open DevTools (optional)
        // mainWindow.webContents.openDevTools();
    }

    app.whenReady().then(() => {
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
            globalShortcut.registerAll(['CommandOrControl+W'], () => {
                return
            })
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
