const connection = require('../app/database')

class RankSerivice {
  async create(info) {
    const { name, rank } = info
    const statement = 'INSERT INTO `rank` (name,`rank`) VALUES (?,?);'
    const [result] = await connection.execute(statement, [name, rank])
    return result
  }
  async search(info) {
    if (Object.keys(info).length === 0) {
      const statement = 'SELECT * FROM `rank`;'
      const [result] = await connection.execute(statement)
      return result
    }
    const { id, name } = info
    const statement = 'SELECT * FROM `rank` WHERE id = ? OR name = ?;'
    const [result] = await connection.execute(statement, [String(id) || '', name || ''])
    return result
  }
  async update(id, info) {
    const { name, rank } = info
    const statement = 'UPDATE `rank` SET `name` = ?, `rank` = ? WHERE id = ?'
    const [result] = await connection.execute(statement, [name, rank, id])
    return result
  }
  async delete(id) {
    const statement = 'DELETE FROM `rank` WHERE id = ?;'
    const [result] = await connection.execute(statement, [id])
    return result
  }
}

module.exports = new RankSerivice()
