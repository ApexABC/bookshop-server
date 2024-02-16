const connection = require('../app/database')

class OderService {
  async addCart(info) {
    const { id, bookId } = info
    const statement = 'SELECT * FROM `cart` WHERE userId = ? AND bookId = ?'
    const [result] = await connection.execute(statement, [id, bookId])
    if (result.length === 0) {
      const statement = 'INSERT INTO `cart` (userId,BookId,count) VALUES (?,?,?)'
      const [result] = await connection.execute(statement, [id, bookId, '1'])
      return result
    } else {
      const statement = 'UPDATE cart SET `count` = ? WHERE id = ?;'
      const [res] = await connection.execute(statement, [String(result[0].count + 1), String(result[0].id)])
      return res
    }
  }
  async changeCartCount(info) {
    const { id, count } = info
    const statement = 'UPDATE cart SET `count` = ? WHERE id = ?;'
    const [result] = await connection.execute(statement, [count, id])
    return result
  }
  async searchCartInfoByUserIdAndBookId(info) {
    const { userId, bookId } = info
    const statement = 'SELECT * FROM `cart` WHERE userId = ? AND bookId = ?'
    const [result] = await connection.execute(statement, [userId, bookId])
    return result
  }
  async searchCartListByUserId(userId) {
    const statement = 'SELECT b.*, c.* FROM `cart` c RIGHT JOIN books b ON c.bookId = b.id WHERE userId = ?'
    const [result] = await connection.execute(statement, [String(userId)])
    return result
  }
  async deleteCart(ids) {
    const [result] = await connection.execute(`DELETE FROM cart WHERE id IN (${ids})`)
    return result
  }
  async getCartCount(id) {
    // 'SELECT COUNT(*) count FROM cart WHERE userId = ?'
    const statement = 'SELECT SUM(count) count FROM cart WHERE userId = ?'
    const [result] = await connection.execute(statement, [String(id)])
    return result
  }
  async addAddress(info) {
    const { userId, name, phone, province, city, district, address, isDefault } = info
    const statement = 'INSERT INTO `address` (userId,name,phone,province,city,district,address,isDefault) VALUES (?,?,?,?,?,?,?,?)'
    const [result] = await connection.execute(statement, [String(userId), name, phone, province, city, district, address, isDefault])
    return result
  }
  async editAddress(info) {
    const { name, phone, province, city, district, address, isDefault, id } = info
    const statement = 'UPDATE `address` SET name = ?,phone = ?,province = ?,city = ?,district = ?,address = ?,isDefault = ? WHERE id = ?;'
    const [result] = await connection.execute(statement, [name, phone, province, city, district, address, isDefault, id])
    return result
  }
  async deleteAddressById(id) {
    const statement = 'DELETE FROM `address` WHERE id = ?'
    const [result] = await connection.execute(statement, [id])
    return result
  }
  async cancelAddressIsDefaultById(id) {
    const statement = 'UPDATE `address` SET `isDefault` = 0 WHERE id = ?;'
    const [result] = await connection.execute(statement, [id])
    return result
  }
  async getAddressListById(id) {
    const statement = 'SELECT * FROM `address` WHERE userId = ?'
    const [result] = await connection.execute(statement, [String(id)])
    return result
  }
  async addBrought(info) {
    const { userId, bookId, totalCount, totalPrice } = info
    const statement = 'INSERT INTO `bought` (userId,bookId,totalCount,totalPrice) VALUES (?,?,?,?)'
    const [result] = await connection.execute(statement, [userId, bookId, totalCount, totalPrice])
    return result
  }
  async addOrder(info) {
    const { userId, boughtId, totalPrice, address, status } = info
    const statement = 'INSERT INTO `order` (userId, boughtId, totalPrice, address, status) VALUES (?,?,?,?,?)'
    const [result] = await connection.execute(statement, [userId, boughtId, totalPrice, address, status])
    return result
  }
  async searchOrderList(id) {
    const statement = 'SELECT * FROM `order`'
    const [result] = await connection.execute(statement, [String(id)])
    return result
  }
  async searchOrderByUserIds(id) {
    const statement = 'SELECT * FROM `order` WHERE userId = ?'
    const [result] = await connection.execute(statement, [String(id)])
    return result
  }
  async searchOrderBookListByIds(ids) {
    const [result] = await connection.execute(`SELECT * FROM bought b LEFT JOIN books bo ON b.bookId = bo.id WHERE b.id IN (${ids})`)
    return result
  }
  async changeOrderStatus(info) {
    const { status, id } = info
    const statement = 'UPDATE `order` SET `status` = ? WHERE id = ?;'
    const [result] = await connection.execute(statement, [String(status), String(id)])
    return result
  }
  async searchOrderStatusByUserId(userId) {
    const statement =
      'SELECT COUNT(*) AS `全部1`,(SELECT COUNT(*) FROM `order` WHERE userId = ? AND status = 1) AS `待发货`,(SELECT COUNT(*) FROM `order` WHERE userId = ? AND status = 2) AS `待收货`,(SELECT COUNT(*) FROM `order` WHERE userId = ? AND status = 3) AS `已完成` FROM `order` WHERE userId = ?;'
    const [result] = await connection.execute(statement, [userId, userId, userId, userId])
    return result
  }
}

module.exports = new OderService()
