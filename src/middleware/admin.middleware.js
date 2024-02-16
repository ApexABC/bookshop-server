const adminService = require('../service/admin.service')
const { PUBLICK_KEY } = require('../config/screct')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const verifyAdmin = async (ctx, next) => {
  const { username, password } = ctx.request.body
  if (!username || !password) {
    ctx.body = {
      message: '用户名或密码不能为空'
    }
    return
  }
  // 判断admin是否存在
  const users = await adminService.findAdminByName(username)
  if (users.length) {
    ctx.body = {
      code: -1001,
      message: '用户名已经存在，请重试'
    }
    return
  }
  await next()
}
const verifyLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body
  if (!username || !password) {
    ctx.body = {
      message: '用户名或密码不能为空'
    }
    return
  }
  // 查询用户是否在数据库中存在
  const users = await adminService.findAdminByName(username)
  if (!users[0]) {
    return (ctx.body = {
      code: -1001,
      message: '用户不存在'
    })
  }
  // 查询数据库中密码和用户传递的密码是否一致
  if (users[0].password !== password) {
    return (ctx.body = {
      code: -1002,
      message: '密码错误'
    })
  }
  ctx.admin = users[0]
  await next()
}
const verifyAdminToken = async (ctx, next) => {
  const authorization = ctx.headers.authorization
  if (!authorization) {
    return (ctx.body = {
      code: 401,
      message: '无效的token'
    })
  }
  const token = authorization.replace('Bearer ', '')
  // 验证token是否有效
  try {
    const result = jwt.verify(token, PUBLICK_KEY, {
      algorithms: ['RS256']
    })
    // 将token保留下来
    ctx.admin = result
    await next()
  } catch (error) {
    return (ctx.body = {
      code: 401,
      message: '无效token',
      error
    })
  }
}
const verifyIsRoot = async (ctx, next) => {
  if (ctx.admin.type !== 'root') {
    return (
      (ctx.status = 403),
      (ctx.body = {
        code: 403,
        message: '您非管理员，无此权限'
      })
    )
  }
  await next()
}
const verifyIsSelfAccount = async (ctx, next) => {
  const { userId } = ctx.request.body
  const { id, type } = ctx.admin
  if (Number(userId) !== id && type !== 'root')
    return (ctx.body = {
      code: 401,
      message: '您非操作自己账号'
    })
  await next()
}
const clearAlreadyExistAvatar = async (ctx, next) => {
  const { id } = ctx.admin
  const result = await adminService.searchUserById(id)
  const filePath = `./uploads/${result[0].avatar}`
  // return await next()
  if (result[0].avatar === '4aee8ede93971f78fbbf7a9992bfb9a4') {
    // 如果是初始头像则不清除
    return await next()
  } else {
    // 使用 fs.unlink 方法删除文件
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`无法删除文件: ${err}`)
        return
      }
      console.log('头像已成功删除')
    })
    return await next()
  }
}
module.exports = {
  verifyAdmin,
  verifyLogin,
  verifyAdminToken,
  verifyIsRoot,
  verifyIsSelfAccount,
  clearAlreadyExistAvatar
}
