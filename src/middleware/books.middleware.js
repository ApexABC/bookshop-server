const booksService = require('../service/books.service')
const fs = require('fs')
const verifyBooksInfo = async (ctx, next) => {
  const { name, author, describe, rate, pubtime, publisher, price } = ctx.request.body
  const { filename } = ctx.request.file
  if (!name || !author || !describe || !rate || !pubtime || !publisher || !price || !filename) {
    return (ctx.body = {
      code: 400,
      message: '您所传递的参数不完整'
    })
  }
  ctx.booksInfo = {
    name,
    author,
    describe,
    rate,
    pubtime,
    publisher,
    price,
    filename
  }
  await next()
}
const verifyHasBook = async (ctx, next) => {
  const { id } = ctx.request.params
  const result = await booksService.searchBookById(id)
  if (result.length === 0) {
    return (ctx.body = {
      code: 400,
      message: '无效的书籍id'
    })
  }
  await next()
}
const clearAlreadyExistAlbum = async (ctx, next) => {
  const { id } = ctx.request.params
  const result = await booksService.searchBookById(id)
  const filePath = `./uploads/${result[0].album}`
  // 使用 fs.unlink 方法删除文件
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`无法删除文件: ${err}`)
      return
    }
    console.log('文件已成功删除')
  })
  await next()
}
module.exports = {
  verifyBooksInfo,
  verifyHasBook,
  clearAlreadyExistAlbum
}
