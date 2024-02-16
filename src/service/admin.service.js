const connection = require('../app/database')
class AdminService {
  async create(admin) {
    const { username, password } = admin
    const statement = 'INSERT INTO `admin` (username,password) VALUES (?,?);'
    const [result] = await connection.execute(statement, [username, password])
    return result
  }
  async findAdminByName(name) {
    const statement = 'SELECT * FROM `admin` WHERE username = ?;'
    const [values] = await connection.execute(statement, [name])
    return values
  }
  async searchUserByName(name) {
    const statement = 'SELECT * FROM `admin` WHERE username LIKE ?;'
    const [result] = await connection.execute(statement, [`%${name}%`])
    return result
  }
  async searchUserById(id) {
    const statement = 'SELECT * FROM `admin` WHERE id = ?;'
    const [result] = await connection.execute(statement, [id])
    return result
  }
  async searchUserByIdAndPassword(info) {
    const { id, oldPassword } = info
    const statement = 'SELECT * FROM `admin` WHERE id = ? AND password = ?;'
    const [result] = await connection.execute(statement, [id, oldPassword])
    return result
  }
  async searchUserRelationIsExist(fromUserId, toUserId) {
    const statement = 'SELECT * FROM `user_relation` WHERE fromUserId = ? AND toUserId = ?'
    const [result] = await connection.execute(statement, [fromUserId, toUserId])
    return result
  }
  async deleteUserFollowByFromAndToId(fromUserId, toUserId) {
    const statement = 'DELETE FROM `user_relation` WHERE fromUserId = ? AND toUserId = ?'
    const [result] = await connection.execute(statement, [fromUserId, toUserId])
    return result
  }
  async addFllowInfo(fromUserId, toUserId) {
    const statement = 'INSERT INTO `user_relation` (fromUserId,toUserId) VALUES (?,?)'
    const [result] = await connection.execute(statement, [fromUserId, toUserId])
    return result
  }
  async searchUserRelation(id) {
    const followStatement = 'SELECT a.* FROM `user_relation` ur LEFT JOIN `admin` a ON ur.toUserId = a.id WHERE fromUserId = ?'
    const [follows] = await connection.execute(followStatement, [id])
    const fansStatement = 'SELECT a.* FROM `user_relation` ur LEFT JOIN `admin` a ON ur.fromUserId = a.id WHERE toUserId = ?'
    const [fans] = await connection.execute(fansStatement, [id])
    return {
      follows,
      fans
    }
  }
  async updateUserAvatarById(info) {
    const { avatar, id } = info
    const statement = 'UPDATE `admin` SET `avatar` = ? WHERE id = ?;'
    const [result] = await connection.execute(statement, [avatar, id])
    return result
  }
  async updateUsernameById(info) {
    const { username, id } = info
    const statement = 'UPDATE `admin` SET `username` = ? WHERE id = ?;'
    const [result] = await connection.execute(statement, [username, id])
    return result
  }
  async updateUserPasswordById(info) {
    const { password, id } = info
    const statement = 'UPDATE `admin` SET `password` = ? WHERE id = ?;'
    const [result] = await connection.execute(statement, [password, id])
    return result
  }
}

module.exports = new AdminService()
