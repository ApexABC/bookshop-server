const KoaRouter = require('@koa/router')
const fs = require('fs')
const uploadsRouter = new KoaRouter({ prefix: '/uploads' })

uploadsRouter.get('/:filename', (ctx, next) => {
  const { filename } = ctx.request.params
  ctx.type = 'jpg'
  ctx.body = fs.createReadStream(`./uploads/${filename}`)
})
module.exports = uploadsRouter
