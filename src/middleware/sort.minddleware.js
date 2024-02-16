const sortService = require('../service/sort.service')

const verifyAlreadExist = async (ctx, next) => {
  const result = await sortService.searchBindBook(ctx.request.body)
  if (result.length !== 0) {
    return (ctx.body = {
      code: 400,
      message: '已经存在此绑定，不能重复绑定。'
    })
  }
  await next()
}

module.exports = {
  verifyAlreadExist
}
