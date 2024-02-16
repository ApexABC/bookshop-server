const connection = require('../app/database')
class BooksService {
  async create(booksInfo) {
    const { name, author, describe, rate, pubtime, publisher, price, filename } = booksInfo
    const statement = 'INSERT INTO `books` (name,album,author,`describe`,rate,pubtime,publisher,price) VALUE (?,?,?,?,?,?,?,?)'
    const [result] = await connection.execute(statement, [name, filename, author, describe, rate, pubtime, publisher, price])
    return result
  }
  async showBookList(limit = 20, offset = 0) {
    const statement = `SELECT JSON_ARRAYAGG(book) AS bookList,
      (SELECT COUNT(*) as count FROM books) AS count
    FROM (
      SELECT 
        JSON_OBJECT(
          'id', id,
          'name', name,
          'album', album,
          'author', author,
          'describe', \`describe\`, 
          'rate', rate,
          'pubtime', pubtime,
          'publisher', publisher,
          'price', price,
          'inventory',inventory
        ) AS book
    FROM books
    LIMIT ? OFFSET ?
  ) AS subquery;`
    const [[result]] = await connection.execute(statement, [String(limit), String(offset)])
    return result
  }
  async searchBookById(id) {
    const statement = `SELECT * FROM books WHERE id = ?`
    const [result] = await connection.execute(statement, [id])
    return result
  }
  async updateBookInfo(bookInfo) {
    const { name, author, describe, rate, pubtime, publisher, price, filename, id } = bookInfo
    const statement = 'UPDATE books SET `name` = ?,album = ?,author = ?,`describe` = ?,rate = ?,pubtime = ?,publisher = ?,price = ? WHERE id = ?;'
    const [result] = await connection.execute(statement, [name, filename, author, describe, rate, pubtime, publisher, price, id])
    return result
  }
  async delteBookInfo(id) {
    const statement = 'DELETE FROM books WHERE id = ?'
    const [result] = await connection.execute(statement, [id])
    return result
  }
  async searchBookByLike(info) {
    const { like, offset = 0, limit = 1000 } = info
    const statement = 'SELECT * FROM books WHERE name LIKE ? OR author LIKE ? LIMIT ? OFFSET ?;'
    const [result] = await connection.execute(statement, [`%${like}%`, `%${like}%`, String(limit), String(offset)])
    return result
  }
  async searchRandomBook(query) {
    const { limit = 1000, offset = 0 } = query
    const statement = 'SELECT * FROM books ORDER BY RAND() LIMIT ? '
    const [result] = await connection.execute(statement, [limit])
    return result
  }
  async addBookComment(info) {
    const { bookId, userId, parentId = null, quote = null, comment = null, like = 0, likeList = null } = info
    const statement = 'INSERT INTO `comment` (bookId,userId,parentId,quote,`comment`,`like`,likeList) VALUES (?,?,?,?,?,?,?);'
    const [result] = await connection.execute(statement, [bookId, String(userId), parentId, quote, comment, Number(like), likeList])
    return result
  }
  async deleteBookComment(id, parentId) {
    if (parentId === '' || parentId === null || parentId === undefined) {
      const statement = 'DELETE FROM `comment` WHERE id = ? OR parentId = ?'
      const [result] = await connection.execute(statement, [id, id])
      return result
    } else {
      const statement = 'DELETE FROM `comment` WHERE id = ?'
      const [result] = await connection.execute(statement, [id])
      return result
    }
  }
  async searchBookCommentById(id) {
    const statement = 'SELECT c.*, a.username, a.avatar FROM `comment` c LEFT JOIN admin a ON c.userId = a.id WHERE c.bookId = ?'
    const [result] = await connection.execute(statement, [id])
    return result
  }
  async BookCommentLike(info) {
    const { like, likeList, id } = info
    const statement = 'UPDATE `comment` SET `like` = ? , likeList = ? WHERE id = ?'
    const [result] = await connection.execute(statement, [like, likeList, id])
    return result
  }
  async changeBookInventory(info) {
    const { id, inventory } = info
    const statement = 'UPDATE `books` SET `inventory` = ? WHERE id = ?'
    const [result] = await connection.execute(statement, [String(inventory), String(id)])
    return result
  }
}

module.exports = new BooksService()
