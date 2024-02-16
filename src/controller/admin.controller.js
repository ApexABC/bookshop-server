const adminService = require('../service/admin.service')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../config/screct')
const chatService = require('../service/chat.service')
class AdminController {
  async create(ctx, next) {
    const admin = ctx.request.body
    const result = await adminService.create(admin)
    const info = {
      fromUserId: 1,
      toUserId: result.insertId,
      message:
        '欢迎来到图书商城，此网站是个人毕业设计，所以不会有真正付款行为。一、此网站实现了全局响应式，可以完美适配移动端和PC端。二、用户可以通过按照书籍分类或者按着热门排行榜浏览书籍(点击网页头部bookstore可回到首页)，也可以通过搜索进行搜索书籍。可对书籍进行评论，子评论和点赞评论。购买书籍可以通过立即购买和加入购物车两种方式下单。可以查询订单状态。三、网站基于Socket.io实现了即时聊天功能，用户可以通过搜索用户进行私信聊天。聊天记录有存储，即使对方不在线也可私信，待下次对方上线同样可接受信息。四、个人信息页面也可以修改信息，查看关注和粉丝列表。最后，欢迎体验和建议，若有建议可以直接发过来，谢谢。'
    }
    await chatService.addChatMessage(info)
    ctx.body = {
      code: 201,
      message: '创建用户成功',
      data: result
    }
  }
  async sign(ctx, next) {
    const { username, password, type, avatar, id } = ctx.admin
    // 颁发令牌
    const token = jwt.sign({ username, password, type, avatar, id }, PRIVATE_KEY, {
      expiresIn: 24 * 60 * 60,
      algorithm: 'RS256'
    })
    ctx.body = {
      userInfo: {
        username,
        type,
        avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${avatar}`,
        id
      },
      token
    }
  }
  async testToken(ctx, next) {
    const { id, username, type, avatar } = ctx.admin
    const result = await adminService.searchUserById(id)
    ctx.body = {
      code: 200,
      message: 'token通过',
      userInfo: {
        id,
        username: result[0].username,
        type,
        avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${result[0].avatar}`
      }
    }
  }
  async uploadAvatar(ctx) {
    const { id } = ctx.admin
    const { filename } = ctx.request.file
    const info = {
      id,
      avatar: filename
    }
    const result = await adminService.updateUserAvatarById(info)
    ctx.body = {
      code: 201,
      message: '更新头像成功',
      result
    }
  }
  async searchUserByName(ctx) {
    const result = await adminService.searchUserByName(ctx.request.query.like)
    const userList = result.map(({ id, avatar, username }) => {
      return {
        id,
        avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${avatar}`,
        username
      }
    })
    ctx.body = {
      code: 200,
      message: '查询成功',
      userList: userList
    }
  }
  async followUser(ctx) {
    const { id: fromUserId } = ctx.admin
    const { toUserId } = ctx.request.body
    const isExistRes = await adminService.searchUserRelationIsExist(fromUserId, toUserId)
    if (isExistRes.length !== 0) {
      return (ctx.body = {
        code: 400,
        message: '已关注，请勿重复关注'
      })
    }
    const result = await adminService.addFllowInfo(fromUserId, toUserId)
    ctx.body = {
      code: 201,
      message: '关注成功',
      result
    }
  }
  async cancelFollowUser(ctx) {
    const { id: fromUserId } = ctx.admin
    const { toUserId } = ctx.request.body
    const result = await adminService.deleteUserFollowByFromAndToId(fromUserId, toUserId)
    ctx.body = {
      code: 201,
      message: '取消关注成功',
      result
    }
  }
  async searchRelation(ctx) {
    const { id } = ctx.admin
    const res = await adminService.searchUserRelation(id)
    const follows = res.follows.map(({ id, avatar, username }) => {
      return {
        id,
        avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${avatar}`,
        username
      }
    })
    const fans = res.fans.map(({ id, avatar, username }) => {
      return {
        id,
        avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${avatar}`,
        username
      }
    })
    ctx.body = {
      code: 200,
      message: '查询好友关系成功',
      relation: {
        follows,
        fans
      }
    }
  }
  async searchOtherUserInfo(ctx) {
    const { userId } = ctx.request.query
    const userInfo = await adminService.searchUserById(userId)
    const relation = await adminService.searchUserRelation(userId)
    delete userInfo[0].password
    const result = {
      ...userInfo[0],
      avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${userInfo[0].avatar}`,
      followCount: relation.follows.length,
      fansCount: relation.fans.length
    }
    ctx.body = {
      code: 200,
      message: '查询成功',
      otherUserInfo: result
    }
  }
  async updateUsername(ctx) {
    const { id } = ctx.admin
    const { username } = ctx.request.body
    const isExistUser = await adminService.findAdminByName(username)
    if (isExistUser.length !== 0) {
      return (ctx.body = {
        code: 400,
        message: '用户名已存在'
      })
    }
    const info = {
      id,
      username
    }
    const result = await adminService.updateUsernameById(info)
    ctx.body = {
      code: 201,
      message: '更改用户名成功',
      result
    }
  }
  async updateUserPassword(ctx) {
    const { id } = ctx.admin
    const { newPassword: password, oldPassword } = ctx.request.body
    const testRes = await adminService.searchUserByIdAndPassword({ id, oldPassword })
    if (testRes.length === 0) {
      return (ctx.body = {
        code: 400,
        message: '旧密码错误'
      })
    }
    const result = await adminService.updateUserPasswordById({
      id,
      password
    })
    ctx.body = {
      code: 201,
      message: '更改密码成功',
      result
    }
  }
}
module.exports = new AdminController()
