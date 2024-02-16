const connection = require('../app/database')
class DashBoardService {
  async searchBarData() {
    const statement =
      `WITH month_range AS (
      SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') AS month
      FROM (
        SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
      ) AS numbers
    )
    SELECT 
      month_range.month,
      COALESCE(SUM(order.totalPrice), 0) AS total_price
    FROM month_range ` +
      "LEFT JOIN `order` ON DATE_FORMAT(order.createTime, '%Y-%m') = month_range.month " +
      `GROUP BY month_range.month
    ORDER BY month_range.month;`
    const [result] = await connection.execute(statement)
    return result
  }
  async searchPieData() {
    const statement = 'SELECT s.name AS `name`,COUNT(sb.sortId) AS `value` FROM sort s LEFT JOIN sort_book sb ON s.id = sb.sortId GROUP BY s.name'
    const [result] = await connection.execute(statement)
    return result
  }
  async searchBaseInfos() {
    const statement =
      'SELECT COUNT(*) bookNum , (SELECT COUNT(*) FROM `admin`) userNum,(SELECT SUM(totalPRice) FROM `order`) totalPrice,(SELECT SUM(totalCount) FROM `bought`) totalCount FROM `books`'
    const [result] = await connection.execute(statement)
    return result
  }
  async searchTipsData() {
    const orderStatement = 'SELECT * FROM `order` WHERE `status` = 1'
    const [orderResult] = await connection.execute(orderStatement)
    const inventoryStatement = 'SELECT * FROM `books` WHERE inventory <= 10'
    const [inventoryResult] = await connection.execute(inventoryStatement)
    return {
      orderResult,
      inventoryResult
    }
  }
}

module.exports = new DashBoardService()
