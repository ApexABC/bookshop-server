const connection = require('../app/database')

class SortSerivice {
  async create(info) {
    const { name } = info
    const statement = 'INSERT INTO `sort` (name) VALUE (?);'
    const [result] = await connection.execute(statement, [name])
    return result
  }
  async search() {
    const statement = 'SELECT * FROM `sort` ;'
    const [result] = await connection.execute(statement, [])
    return result
  }
  async update(id, info) {
    const { name } = info
    const statement = 'UPDATE `sort` SET `name` = ? WHERE id = ?'
    const [result] = await connection.execute(statement, [name, id])
    return result
  }
  async delete(id) {
    const statement = 'DELETE FROM `sort` WHERE id = ?;'
    const [result] = await connection.execute(statement, [id])
    return result
  }
  async searchBindBook(info) {
    const { sortId, bookId } = info
    const statement = 'SELECT * FROM sort_book WHERE sortId = ? AND bookId = ?;'
    const [result] = await connection.execute(statement, [sortId, bookId])
    return result
  }
  async bindBook(info) {
    const { sortId, bookId } = info
    const statement = 'INSERT INTO `sort_book` (sortId,bookId) VALUES (?,?);'
    const [result] = await connection.execute(statement, [sortId, bookId])
    return result
  }
  async searchBySortId(sortId) {
    const statement =
      "SELECT JSON_ARRAYAGG(JSON_OBJECT('id',sb.id,'sortId',sb.sortId,'bookId',sb.bookId,'sortName',s.name)) AS data FROM sort_book sb LEFT JOIN sort s ON sb.sortId = s.id WHERE s.id = ?"
    const [[result]] = await connection.execute(statement, [sortId])
    return result
  }
  async searchByBookId(bookId) {
    const statement =
      "SELECT JSON_ARRAYAGG(JSON_OBJECT('id',sb.id,'sortId',sb.sortId,'bookId',sb.bookId,'bookName',b.name)) AS data FROM sort_book sb LEFT JOIN books b ON sb.bookId = b.id WHERE b.id = ?"
    const [[result]] = await connection.execute(statement, [bookId])
    return result
  }
  async deleteAllByBookId(bookId) {
    const statement = 'DELETE FROM sort_book WHERE bookId = ?'
    const [result] = await connection.execute(statement, [bookId])
    return result
  }
  async searchBookListBySortId(sortId) {
    const statement = 'SELECT b.* FROM books b LEFT JOIN sort_book sb ON b.id = sb.bookId WHERE sortId = ?'
    const [result] = await connection.execute(statement, [sortId])
    return result
  }
}

module.exports = new SortSerivice()
