import { createServer } from 'node:http'
import next from 'next'
import { createPresenceWss, handlePresenceUpgrade } from '@/lib/multiplayer/ws-handler'

// Default dev port is 6829 — chosen to dodge collisions with other local
// Next.js / Vite projects sitting on 3000/3001/5173. Override via PORT.
// Hosted environments (Vercel, Railway, Render) set PORT themselves, so
// production deployments are unaffected by this default.
const port = parseInt(process.env.PORT || '6829', 10)
// Bind to 0.0.0.0 always — Railway sets HOSTNAME to the container id,
// which makes the app unreachable by the healthcheck proxy.
const hostname = '0.0.0.0'
const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

void app.prepare().then(() => {
    const upgradeNext = app.getUpgradeHandler()
    const httpServer = createServer((req, res) => {
        handle(req, res).catch((err) => {
            console.error('[next] request error', err)
            if (!res.headersSent) {
                res.statusCode = 500
                res.end('Internal Server Error')
            }
        })
    })

    const wss = createPresenceWss()

    httpServer.on('upgrade', (req, socket, head) => {
        if (handlePresenceUpgrade(wss, req, socket, head)) return
        // Fall through to Next so HMR/dev WS upgrades keep working.
        upgradeNext(req, socket, head).catch((err) => {
            console.error('[next] upgrade error', err)
            socket.destroy()
        })
    })

    httpServer.listen(port, hostname, () => {
        console.log(`> ready on http://${hostname}:${port} (${dev ? 'dev' : 'prod'})`)
    })

    const shutdown = () => {
        httpServer.close(() => process.exit(0))
        setTimeout(() => process.exit(0), 5_000).unref?.()
    }
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
})
