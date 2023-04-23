import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { logger } from '../logger/logger'
import { CushyClient } from './Client'
import { Workspace } from './Workspace'
import { posix } from 'path'

export class CushyServer {
    http: http.Server
    app: express.Application
    wss: WebSocketServer
    port = 8288

    constructor(public workspace: Workspace) {
        logger().info('🫖 creating CushyServer express app...')
        const app = express()
        this.app = app

        const extensionURI = workspace.context.extensionUri
        const webviewDistURI = extensionURI.with({ path: posix.join(extensionURI.path, 'dist', 'webview') })
        logger().info(`🫖 mounting webview folder ${webviewDistURI.path}`)
        app.use(express.static(webviewDistURI.path))

        // app.get('/', (req, res) => res.sendFile(webviewDistURI.path + '/index.html'))
        // app.get('/index.html', (req, res) => res.sendFile(webviewDistURI.path + '/index.html'))
        // app.get('/assets/index.css', (req, res) => res.sendFile(webviewDistURI.path + '/assets/index.css'))
        // app.get('/assets/index.js', (req, res) => res.sendFile(webviewDistURI.path + '/assets/index.js'))
        // app.get('/CushyLogo.png', (req, res) => res.sendFile(webviewDistURI.path + '/CushyLogo.png'))
        // app.get('/painterro-1.2.78.min.js', (req, res) => res.sendFile(webviewDistURI.path + '/painterro-1.2.78.min.js'))

        app.get('/test', (req, res) => {
            res.send('Hello World!')
        })

        logger().info('🫖 creating CushyServer http server...')
        const server = http.createServer(app)
        this.http = server

        logger().info(`🫖 mounting public folder ${workspace.cacheFolderAbsPath}...`)
        app.use(express.static(workspace.cacheFolderAbsPath))

        logger().info(`🫖 creating CushyServer websocket server... ${workspace.cacheFolderAbsPath}...`)
        console.log(WebSocketServer)
        const wss = new WebSocketServer({ server })
        this.wss = wss

        wss.on('connection', (ws) => new CushyClient(this.workspace, ws))
        logger().info('🫖 listening on port 8288...')
        this.listen()
    }
    listen = async () => {
        this.http
            .listen(this.port, '0.0.0.0', () => {
                logger().info(`🫖 🟢 Server is running at http://localhost:${this.port}`)
            })
            .on('error', (err) => {
                logger().error('Server error')
            })
    }
}
