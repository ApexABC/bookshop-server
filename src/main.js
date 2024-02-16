const app = require('./app')
const setupSocket = require('./socket')
const { SERVE_PORT, SERVE_HOST } = require('./config/serve')
const { createServer } = require('http')
// koa
const server = createServer(app.callback())
// socket
setupSocket(server)

server.listen(SERVE_PORT, () => {
  console.log(`服务端启动成功：${SERVE_HOST}:${SERVE_PORT}`)
})
