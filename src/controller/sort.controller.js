const SortSerivice = require('../service/sort.service')

class SortController {
  async create(ctx, next) {
    const result = await SortSerivice.create(ctx.request.body)
    return (ctx.body = {
      code: 201,
      message: '新增种类成功',
      result
    })
  }
  async search(ctx, next) {
    const result = await SortSerivice.search()
    return (ctx.body = {
      code: 200,
      message: '查询数据成功',
      data: result
    })
  }
  async update(ctx, next) {
    const { id } = ctx.request.params
    const result = await SortSerivice.update(id, ctx.request.body)
    return (ctx.body = {
      code: 201,
      message: '修改数据成功',
      result
    })
  }
  async deleteById(ctx, next) {
    const { id } = ctx.request.params
    const result = await SortSerivice.delete(id)
    return (ctx.body = {
      code: 201,
      message: '删除榜单成功',
      result
    })
  }
  async bindBook(ctx, next) {
    const result = await SortSerivice.bindBook(ctx.request.body)
    return (ctx.body = {
      code: 201,
      message: '绑定种类成功',
      result
    })
  }
  async searchBySortId(ctx, next) {
    const result = await SortSerivice.searchBySortId(ctx.request.query.sortId)
    return (ctx.body = {
      code: 200,
      message: '查询成功',
      data: result.data
    })
  }
  async searchByBookId(ctx, next) {
    const result = await SortSerivice.searchByBookId(ctx.request.query.bookId)
    return (ctx.body = {
      code: 200,
      message: '查询成功',
      data: result.data
    })
  }
  async deleteAllByBookId(ctx) {
    const result = await SortSerivice.deleteAllByBookId(ctx.params.bookId)
    return (ctx.body = {
      code: 201,
      message: '删除成功',
      result
    })
  }
  async searchBookListBySortId(ctx) {
    const { sortId } = ctx.request.query
    const result = await SortSerivice.searchBookListBySortId(sortId)
    const bookList = result.map(({ album, ...res }) => {
      return {
        album: `${SERVE_HOST}:${SERVE_PORT}/uploads/${album}`,
        ...res
      }
    })
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: {
        bookList,
        count: result.length
      }
    }
  }
}

module.exports = new SortController()
