import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { logger } from '../logger/logger'
import { CushyClient } from './Client'
import { Workspace } from './Workspace'

export class CushyServer {
    http: http.Server
    app: express.Application
    wss: WebSocketServer
    port = 8288

    constructor(public workspace: Workspace) {
        logger().info('🐙 creating CushyServer express app...')
        const app = express()
        this.app = app

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        logger().info('creating CushyServer http server...')
        const server = http.createServer(app)
        this.http = server

        // add a static file server to serve the static files in the public folder
        logger().info(`mounting public folder ${workspace.cacheFolderAbsPath}...`)
        app.use(express.static(workspace.cacheFolderAbsPath))

        logger().info(`creating CushyServer websocket server... ${workspace.cacheFolderAbsPath}...`)
        console.log(WebSocketServer)
        const wss = new WebSocketServer({ server })
        this.wss = wss

        wss.on('connection', (ws) => new CushyClient(this.workspace, ws))
        logger().info('listening on port 8288...')
        this.listen()
    }
    listen = async () => {
        this.http
            .listen(this.port, () => {
                logger().info(`Server is running at http://localhost:${this.port}`)
            })
            .on('error', (err) => {
                logger().error('Server error')
            })
    }
}
