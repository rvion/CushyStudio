const { app, BrowserWindow } = require('electron')
const path = require('path')

// const remoteMain = require('@electron/remote/main')
// remoteMain.initialize()

function createWindow() {
    const mainWindow = new BrowserWindow({
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

    // load cushy
    mainWindow.loadURL('http://localhost:5173') // Load your localhost URL

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
    if (process.platform !== 'darwin') app.quit()
})
