const KoaRouter = require('@koa/router')
const { verifyAdminToken, verifyIsRoot } = require('../middleware/admin.middleware')
const {
  addCart,
  addCartImmediate,
  changeCartCount,
  searchCartList,
  deleteCart,
  getCartCount,
  addAddress,
  getAddressList,
  editAddress,
  deleteAddress,
  subOrder,
  getUserOrderList,
  getAdminOrderList,
  changeOrderStatus,
  getOrderStatus
} = require('../controller/order.controller')
const orderRouter = new KoaRouter({ prefix: '/order' })

// 购物车相关
orderRouter.post('/addCart', verifyAdminToken, addCart)
orderRouter.post('/addCart/immediate', verifyAdminToken, addCartImmediate)
orderRouter.patch('/cartCount', verifyAdminToken, changeCartCount)
orderRouter.get('/cartList', verifyAdminToken, searchCartList)
orderRouter.delete('/deleteCart', verifyAdminToken, deleteCart)
orderRouter.get('/cartCount', verifyAdminToken, getCartCount)
// 地址相关
orderRouter.post('/address', verifyAdminToken, addAddress)
orderRouter.get('/address', verifyAdminToken, getAddressList)
orderRouter.delete('/address/:id', verifyAdminToken, deleteAddress)
orderRouter.patch('/address', verifyAdminToken, editAddress)
// 订单相关
orderRouter.post('/subOrder', verifyAdminToken, subOrder)
orderRouter.get('/orderList/user', verifyAdminToken, getUserOrderList)
orderRouter.get('/orderList/admin', verifyAdminToken, verifyIsRoot, getAdminOrderList)
orderRouter.post('/changeOrderStatus', verifyAdminToken, changeOrderStatus)
orderRouter.get('/getOrderStatus', verifyAdminToken, getOrderStatus)
module.exports = orderRouter
