const KoaRouter = require('@koa/router')
const { verifyAdminToken, verifyIsRoot, verifyIsSelfAccount } = require('../middleware/admin.middleware')
const { handleAlbum } = require('../middleware/file.middleware')
const { verifyBooksInfo, verifyHasBook, clearAlreadyExistAlbum } = require('../middleware/books.middleware')
const {
  create,
  showBookList,
  updataBook,
  deleteBook,
  searchLikeBook,
  searchRandomBook,
  searchBookDetail,
  addBookComment,
  deleteBookComment,
  searchBookComment,
  likeBookComment,
  changeBookInventory
} = require('../controller/books.controller')
const booksRouter = new KoaRouter({ prefix: '/books' })
// 新增书籍
booksRouter.post('/', verifyAdminToken, verifyIsRoot, handleAlbum, verifyBooksInfo, create)
// 展示书籍列表
booksRouter.get('/', showBookList)
// 修改书籍信息 不通过handleAlbum是拿不到 ctx.request.body中的数据的
booksRouter.patch('/:id', verifyAdminToken, verifyIsRoot, handleAlbum, verifyBooksInfo, verifyHasBook, clearAlreadyExistAlbum, updataBook)
// 删除书籍
booksRouter.delete('/:id', verifyAdminToken, verifyIsRoot, verifyHasBook, deleteBook)
// 根据书名和作者模糊查询
booksRouter.get('/like', searchLikeBook)
// 展示随机书籍列表
booksRouter.get('/random', searchRandomBook)
// 展示书籍详情信息
booksRouter.get('/detail', searchBookDetail)
// 新增书籍评论
booksRouter.post('/comment', verifyAdminToken, addBookComment)
// 删除书籍评论
booksRouter.delete('/comment/delete', verifyAdminToken, verifyIsSelfAccount, deleteBookComment)
// 查询书籍评论
booksRouter.get('/comment', searchBookComment)
// 点赞书籍评论
booksRouter.post('/comment/like', verifyAdminToken, likeBookComment)
// 修改书籍库存
booksRouter.post('/inventory', verifyAdminToken, verifyIsRoot, changeBookInventory)
module.exports = booksRouter
