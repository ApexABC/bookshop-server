const booksService = require('../service/books.service')
const { SERVE_PORT, SERVE_HOST } = require('../config/serve')
class BooksController {
  async create(ctx, next) {
    const result = await booksService.create(ctx.booksInfo)
    return (ctx.body = {
      code: 201,
      message: '新增书籍成功'
    })
  }
  async showBookList(ctx, next) {
    const { limit, offset } = ctx.request.query
    let result = await booksService.showBookList(limit, offset)
    let { bookList, count } = result
    bookList = bookList.map(({ album, ...res }) => {
      return {
        album: `${SERVE_HOST}:${SERVE_PORT}/uploads/${album}`,
        ...res
      }
    })
    ctx.body = {
      code: 200,
      message: '获取书籍列表成功',
      data: { bookList, count }
    }
  }
  async updataBook(ctx, next) {
    const { id } = ctx.request.params
    const { name, author, describe, rate, pubtime, publisher, price } = ctx.request.body
    const { filename } = ctx.request.file
    const booksInfo = {
      name,
      author,
      describe,
      rate,
      pubtime,
      publisher,
      price,
      filename,
      id
    }
    const result = await booksService.updateBookInfo(booksInfo)
    return (ctx.body = {
      code: 201,
      message: '书籍信息修改成功',
      result
    })
  }
  async deleteBook(ctx, next) {
    const { id } = ctx.request.params
    const result = await booksService.delteBookInfo(id)
    return (ctx.body = {
      code: 201,
      message: '删除书籍成功',
      result
    })
  }
  async searchLikeBook(ctx, next) {
    const result = await booksService.searchBookByLike(ctx.request.query)
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
  async searchRandomBook(ctx, next) {
    const result = await booksService.searchRandomBook(ctx.request.query)
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
  async searchBookDetail(ctx, next) {
    const { id } = ctx.request.query
    const result = await booksService.searchBookById(id)
    result[0].album = `${SERVE_HOST}:${SERVE_PORT}/uploads/${result[0].album}`
    ctx.body = {
      code: 200,
      message: '查询成功',
      bookInfo: result[0]
    }
  }
  // 新增书籍评论
  async addBookComment(ctx, next) {
    const { bookId, parentId, comment, quote, like, likeList } = ctx.request.body
    const { id: userId } = ctx.admin
    const info = {
      bookId,
      userId,
      parentId,
      comment,
      quote,
      like,
      likeList
    }
    const result = await booksService.addBookComment(info)
    ctx.body = {
      code: 201,
      message: '新增书籍评论成功',
      result
    }
  }
  async deleteBookComment(ctx, next) {
    const { id, parentId } = ctx.request.body
    const result = await booksService.deleteBookComment(id, parentId)
    ctx.body = {
      code: 201,
      message: '删除评论成功',
      result
    }
  }
  async searchBookComment(ctx, next) {
    const { bookId } = ctx.request.query
    const result = await booksService.searchBookCommentById(bookId)
    const commentList = []
    for (const item of result) {
      if (!item.parentId) {
        commentList.push({
          ...item,
          avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${item.avatar}`,
          likeList: item.likeList ? item.likeList.split(',').map(Number) : [],
          children: []
        })
      } else {
        const curIndex = commentList.findIndex((parent) => parent.id === item.parentId)
        commentList[curIndex].children.push({
          ...item,
          avatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${item.avatar}`,
          likeList: item.likeList ? item.likeList.split(',').map(Number) : []
        })
      }
    }
    ctx.body = {
      code: 200,
      message: '查询成功',
      commentList
    }
  }
  async likeBookComment(ctx, next) {
    const { id: userId } = ctx.admin
    let { id, like, likeList } = ctx.request.body
    likeList = likeList.split(',').map(Number)
    const curIndex = likeList.findIndex((item) => item === userId)
    if (curIndex !== -1) {
      // 代表已经点过赞了取消点赞
      likeList.splice(curIndex, 1)
      const info = {
        id,
        like: like - 1,
        likeList: likeList.join(',')
      }
      const result = await booksService.BookCommentLike(info)
      ctx.body = {
        code: 2011,
        message: '取消点赞成功',
        result
      }
    } else {
      // 未点赞，新增点赞
      likeList.push(userId)
      const info = {
        id,
        like: +like + 1,
        likeList: likeList.join(',')
      }
      const result = await booksService.BookCommentLike(info)
      ctx.body = {
        code: 2012,
        message: '点赞成功',
        result
      }
    }
  }
  async changeBookInventory(ctx, next) {
    const result = await booksService.changeBookInventory(ctx.request.body)
    ctx.body = {
      code: 201,
      message: '修改库存成功',
      result
    }
  }
}

module.exports = new BooksController()
