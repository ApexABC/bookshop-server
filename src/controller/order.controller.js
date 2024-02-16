const { SERVE_PORT, SERVE_HOST } = require('../config/serve')
const booksService = require('../service/books.service')
const orderService = require('../service/order.service')

class OrderController {
  async addCart(ctx, next) {
    const { id } = ctx.admin
    const { bookId } = ctx.request.body
    const info = { id: String(id), bookId }
    const result = await orderService.addCart(info)
    ctx.body = {
      code: 201,
      message: '添加购物车成功',
      result
    }
  }
  async addCartImmediate(ctx) {
    const { id: userId } = ctx.admin
    const { bookId } = ctx.request.body
    const res = await orderService.searchCartInfoByUserIdAndBookId({ userId, bookId })
    let cartId
    if (res.length !== 0) {
      // 如果购物车中已有该商品则重置数量为1
      const { id } = res[0]
      cartId = id
      await orderService.changeCartCount({ id, count: 1 })
    } else {
      const res = await orderService.addCart({ id: userId, bookId })
      cartId = res.insertId
    }
    ctx.body = {
      code: 201,
      message: '立即添加购物车成功',
      cartId
    }
  }
  async changeCartCount(ctx, next) {
    const result = await orderService.changeCartCount(ctx.request.body)
    ctx.body = {
      code: 201,
      message: '修改购物车数量成功',
      result
    }
  }
  async searchCartList(ctx, next) {
    const { id } = ctx.admin
    const result = await orderService.searchCartListByUserId(id)
    const bookList = result.map(({ album, ...res }) => {
      return {
        album: `${SERVE_HOST}:${SERVE_PORT}/uploads/${album}`,
        ...res
      }
    })
    ctx.body = {
      code: 200,
      message: '查询购物车列表成功',
      cartList: bookList
    }
  }
  async deleteCart(ctx) {
    const { ids } = ctx.request.body
    const result = await orderService.deleteCart(ids)
    ctx.body = {
      code: 201,
      message: '删除购物车成功',
      result
    }
  }
  async getCartCount(ctx) {
    const { id } = ctx.admin
    const result = await orderService.getCartCount(id)
    ctx.body = {
      code: 200,
      message: '查询成功',
      count: Number(result[0].count)
    }
  }
  async addAddress(ctx) {
    const { id: userId } = ctx.admin
    const { isDefault } = ctx.request.body
    if (isDefault == 1) {
      const res = await orderService.getAddressListById(userId)
      for (const item of res) {
        await orderService.cancelAddressIsDefaultById(item.id)
      }
    }
    const info = {
      userId,
      ...ctx.request.body
    }
    const result = await orderService.addAddress(info)
    ctx.body = {
      code: 201,
      message: '添加地址成功',
      result
    }
  }
  async editAddress(ctx) {
    const { id: userId } = ctx.admin
    const { isDefault } = ctx.request.body
    if (isDefault == 1) {
      const res = await orderService.getAddressListById(userId)
      for (const item of res) {
        await orderService.cancelAddressIsDefaultById(item.id)
      }
    }
    const result = await orderService.editAddress(ctx.request.body)
    ctx.body = {
      code: 201,
      message: '编辑地址成功',
      result
    }
  }
  async deleteAddress(ctx) {
    const { id } = ctx.request.params
    const result = await orderService.deleteAddressById(id)
    ctx.body = {
      code: 201,
      message: '删除地址成功',
      result
    }
  }
  async getAddressList(ctx) {
    const { id } = ctx.admin
    const result = await orderService.getAddressListById(id)
    ctx.body = {
      code: 200,
      message: '查询地址成功',
      addressList: result
    }
  }
  // 提交订单
  async subOrder(ctx) {
    const { id: userId } = ctx.admin
    const { address, goods } = ctx.request.body
    // 查询书籍对应库存和对库存减量
    const bookInfoResultPro = goods.map((item) => booksService.searchBookById(item.bookId))
    const bookInfos = await Promise.all(bookInfoResultPro)
    const bookInventoryInfos = bookInfos.map((item) => ({
      id: item[0].id,
      inventory: item[0].inventory,
      count: goods.find((i) => i.bookId === item[0].id).totalCount
    }))
    for (const item of bookInfos) {
      if (item[0].inventory < 1) {
        ctx.body = {
          code: -1001,
          message: `${item.name}库存不足，联系管理员添加`
        }
      }
    }
    // 减库存
    bookInventoryInfos.forEach((item) => booksService.changeBookInventory({ id: item.id, inventory: item.inventory - item.count }))
    // 删除购物车对应商品
    await orderService.deleteCart(goods.map((item) => item.cartId).join(','))
    // 添加到已买商品
    const results = goods.map((item) =>
      orderService.addBrought({ userId, bookId: item.bookId, totalCount: item.totalCount, totalPrice: item.totalPrice })
    )
    const res = await Promise.all(results)
    const boughtId = res.map((item) => item.insertId).join(',')
    const totalPrice = goods.reduce((per, cur) => per + cur.totalPrice, 0)
    const info = {
      userId,
      boughtId,
      totalPrice,
      address,
      status: 1
    }
    // 添加订单信息
    const result = await orderService.addOrder(info)
    ctx.body = {
      code: 201,
      message: '购买成功',
      result
    }
  }
  async getUserOrderList(ctx) {
    const { id: userId } = ctx.admin
    const orderList = await orderService.searchOrderByUserIds(userId)
    for (const item of orderList) {
      let res = await orderService.searchOrderBookListByIds(item.boughtId)
      res = res.map(({ album, ...res }) => ({
        album: `${SERVE_HOST}:${SERVE_PORT}/uploads/${album}`,
        ...res
      }))
      item.boughtList = res
    }
    ctx.body = {
      code: 200,
      message: '获取订单列表成功',
      orderList
    }
  }
  async getAdminOrderList(ctx) {
    const { id: userId } = ctx.admin
    const orderList = await orderService.searchOrderList(userId)
    for (const item of orderList) {
      let res = await orderService.searchOrderBookListByIds(item.boughtId)
      res = res.map(({ album, ...res }) => ({
        album: `${SERVE_HOST}:${SERVE_PORT}/uploads/${album}`,
        ...res
      }))
      item.boughtList = res
    }
    ctx.body = {
      code: 200,
      message: '获取订单列表成功',
      orderList
    }
  }
  async changeOrderStatus(ctx) {
    const result = await orderService.changeOrderStatus(ctx.request.body)
    ctx.body = {
      code: 200,
      message: '切换订单状态为' + ctx.request.body.status,
      result
    }
  }
  async getOrderStatus(ctx) {
    const { id: userId } = ctx.admin
    const result = await orderService.searchOrderStatusByUserId(userId)
    ctx.body = {
      code: 200,
      message: '查询状态成功',
      status: result[0]
    }
  }
}

module.exports = new OrderController()
