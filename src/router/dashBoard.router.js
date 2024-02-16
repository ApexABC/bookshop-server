const KoaRouter = require('@koa/router')
const { searchBarData, searchPieData, searchBaseInfo, searchTipsData } = require('../controller/dashBoard.controller')

const dashBoardRouter = new KoaRouter({ prefix: '/dash' })

dashBoardRouter.get('/barData', searchBarData)
dashBoardRouter.get('/pieData', searchPieData)
dashBoardRouter.get('/baseData', searchBaseInfo)
dashBoardRouter.get('/tipsData', searchTipsData)
module.exports = dashBoardRouter
