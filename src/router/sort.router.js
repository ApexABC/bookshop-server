const KoaRouter = require('@koa/router')
const { verifyAdminToken, verifyIsRoot } = require('../middleware/admin.middleware')
const {
  create,
  search,
  update,
  deleteById,
  bindBook,
  searchBySortId,
  searchByBookId,
  deleteAllByBookId,
  searchBookListBySortId
} = require('../controller/sort.controller')
const { verifyAlreadExist } = require('../middleware/sort.minddleware')
const sortRouter = new KoaRouter({ prefix: '/sort' })

// 书籍种类增删改查
sortRouter.post('/', verifyAdminToken, verifyIsRoot, create)
sortRouter.get('/', search)
sortRouter.patch('/:id', verifyAdminToken, verifyIsRoot, update)
sortRouter.delete('/:id', verifyAdminToken, verifyIsRoot, deleteById)
// 绑定种类和书籍
sortRouter.post('/bindBook', verifyAdminToken, verifyIsRoot, verifyAlreadExist, bindBook)
// 根据种类ID查询
sortRouter.get('/searchBySortId', searchBySortId)
// 根据书籍ID查询
sortRouter.get('/searchByBookId', searchByBookId)
// 根据书籍ID删除所有绑定
sortRouter.delete('/deleteAllByBookId/:bookId', verifyAdminToken, verifyIsRoot, deleteAllByBookId)
// 根据种类Id查询书籍列表
sortRouter.get('/searchBookListBySortId', searchBookListBySortId)
module.exports = sortRouter
