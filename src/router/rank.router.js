const KoaRouter = require('@koa/router')
const { verifyAdminToken, verifyIsRoot } = require('../middleware/admin.middleware')
const { create, search, updata, deleteById, searchBookRankListById } = require('../controller/rank.controller')
const rankRouter = new KoaRouter({ prefix: '/rank' })

// 增加榜单
rankRouter.post('/', verifyAdminToken, verifyIsRoot, create)
// 查询榜单
rankRouter.get('/', search)
// 修改榜单
rankRouter.patch('/:id', verifyAdminToken, verifyIsRoot, updata)
// 删除榜单
rankRouter.delete('/:id', verifyAdminToken, verifyIsRoot, deleteById)
// 根据榜单id查询榜单书籍列表
rankRouter.get('/searchBookRankListById/:id', searchBookRankListById)
module.exports = rankRouter
