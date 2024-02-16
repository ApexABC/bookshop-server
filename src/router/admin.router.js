const KoaRouter = require('@koa/router')
const { verifyAdmin, verifyLogin, verifyAdminToken, clearAlreadyExistAvatar } = require('../middleware/admin.middleware')
const adminController = require('../controller/admin.controller')
const { handleAvatar } = require('../middleware/file.middleware')
const adminRouter = new KoaRouter({ prefix: '/admin' })

// 注册admin ,
adminRouter.post('/', verifyAdmin, adminController.create)
// 登录admin
adminRouter.post('/login', verifyLogin, adminController.sign)
// 测试token验证
adminRouter.get('/', verifyAdminToken, adminController.testToken)
// 上传头像
adminRouter.post('/avatar', verifyAdminToken, handleAvatar, clearAlreadyExistAvatar, adminController.uploadAvatar)
// 修改用户名
adminRouter.patch('/username', verifyAdminToken, adminController.updateUsername)
// 修改密码
adminRouter.patch('/password', verifyAdminToken, adminController.updateUserPassword)
// 根据用户名模糊查询
adminRouter.get('/like', adminController.searchUserByName)
// 关注
adminRouter.post('/follow', verifyAdminToken, adminController.followUser)
// 取消关注
adminRouter.delete('/follow', verifyAdminToken, adminController.cancelFollowUser)
// 获取粉丝和关注
adminRouter.get('/relation', verifyAdminToken, adminController.searchRelation)
// 获取他人用户信息
adminRouter.get('/getOtherUserInfo', adminController.searchOtherUserInfo)
module.exports = adminRouter
