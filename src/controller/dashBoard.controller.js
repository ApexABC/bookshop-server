const dashBoardService = require('../service/dashBoard.service')

class DashBoardController {
  async searchBarData(ctx) {
    const result = await dashBoardService.searchBarData()
    ctx.body = {
      code: 200,
      message: '查询成功',
      barData: {
        xData: result.map((item) => item.month),
        yData: result.map((item) => item.total_price)
      }
    }
  }
  async searchPieData(ctx) {
    const result = await dashBoardService.searchPieData()
    ctx.body = {
      code: 200,
      message: '查询成功',
      pieData: result
    }
  }
  async searchBaseInfo(ctx) {
    const result = await dashBoardService.searchBaseInfos()
    ctx.body = {
      code: 200,
      message: '查询成功',
      baseData: result[0]
    }
  }
  async searchTipsData(ctx) {
    const result = await dashBoardService.searchTipsData()
    ctx.body = {
      code: 200,
      message: '查询成功',
      tipsData: result
    }
  }
}

module.exports = new DashBoardController()
