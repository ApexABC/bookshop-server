const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('@koa/cors')
const registerRouters = require('../router')

// 创建app
const app = new Koa()
// 对app使用中间件
app.use(bodyParser())
app.use(cors())
// app.use(userRouter.routes(), userRouter.allowedMethods())
// app.use(loginRouter.routes(), loginRouter.allowedMethods())
// 使用自动方法
registerRouters(app)

module.exports = app
