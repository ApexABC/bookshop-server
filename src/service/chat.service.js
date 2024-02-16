const connection = require('../app/database')
class ChatService {
  async searchAboutMessageByUserId(id) {
    const statement =
      'SELECT chat.*, adminFrom.username AS fromUsername, adminFrom.avatar AS fromAvatar, adminTo.username AS toUsername, adminTo.avatar AS toAvatar FROM chat INNER JOIN admin AS adminFrom ON chat.fromUserId = adminFrom.id INNER JOIN admin AS adminTo ON chat.toUserId = adminTo.id WHERE `fromUserId` = ? OR `toUserId` = ?'
    const [result] = await connection.execute(statement, [id, id])
    return result
  }
  async addChatMessage(info) {
    const { fromUserId, toUserId, message } = info
    if (fromUserId === toUserId) return
    const statement = 'INSERT INTO `chat` (fromUserId, toUserId, `message`)  VALUES (?,?,?)'
    const [result] = await connection.execute(statement, [fromUserId, toUserId, message])
    return result
  }
  async alreadyRead(info) {
    const { fromUserId, toUserId } = info
    const statement = 'UPDATE `chat` SET isRead = 1 WHERE fromUserId = ? AND toUserId = ?'
    const [result] = await connection.execute(statement, [fromUserId, toUserId])
    return result
  }
}
module.exports = new ChatService()
