const booksService = require('../service/books.service')
const RankSerivice = require('../service/rank.service')

class RankController {
  async create(ctx, next) {
    const result = await RankSerivice.create(ctx.request.body)
    return (ctx.body = {
      code: 201,
      message: '新增榜单成功',
      result
    })
  }
  async search(ctx, next) {
    const result = await RankSerivice.search(ctx.request.query)
    return (ctx.body = {
      code: 200,
      message: '查询数据成功',
      data: result
    })
  }
  async updata(ctx, next) {
    const { id } = ctx.request.params
    const result = await RankSerivice.update(id, ctx.request.body)
    return (ctx.body = {
      code: 201,
      message: '修改数据成功',
      result
    })
  }
  async deleteById(ctx, next) {
    const { id } = ctx.request.params
    const result = await RankSerivice.delete(id)
    return (ctx.body = {
      code: 201,
      message: '删除榜单成功',
      result
    })
  }
  async searchBookRankListById(ctx, next) {
    const { id } = ctx.request.params
    const RankResult = await RankSerivice.search({ id })
    const tar = RankResult[0].rank.split(',').map((item) => Number(item))
    let { bookList, count } = await booksService.showBookList(1000)
    bookList.sort((a, b) => tar.indexOf(a.id) - tar.indexOf(b.id))
    bookList = bookList.map(({ album, ...res }) => {
      return {
        album: `${SERVE_HOST}:${SERVE_PORT}/uploads/${album}`,
        ...res
      }
    })
    return (ctx.body = {
      code: 200,
      message: '查询成功',
      data: {
        bookList,
        count
      }
    })
  }
}

module.exports = new RankController()
