const { Server } = require('socket.io')
const chatService = require('../service/chat.service')
const { formatChatMessage } = require('../utils/format')

function setupSocket(server) {
  const io = new Server(server, {
    cors: []
  })
  const connectUserList = []
  io.on('connection', async (socket) => {
    const userId = Number(socket.handshake.query.userId)
    if (!userId) return
    const socketId = socket.id
    const curUserInfo = connectUserList.find((item) => item.userId === userId)
    if (curUserInfo) {
      curUserInfo.socketId = socketId
    } else {
      connectUserList.push({
        userId,
        socketId
      })
    }

    // 初始连接返回用户相关的聊天信息
    const messageList = await getMessageList(userId)
    socket.emit('initMsg', messageList)
    socket.on('sendMessage', async (mes) => {
      console.log('mes===>', mes)
      // 监听到用户发消息，并对自己和对方刷新消息
      await chatService.addChatMessage(mes)
      const fromMessageList = await getMessageList(userId)
      const fromUserSocketId = getSocketIdByUserId(connectUserList, mes.fromUserId)
      io.to(fromUserSocketId).emit(String(mes.fromUserId), fromMessageList)

      const toMessageList = await getMessageList(mes.toUserId)
      const toUserSocketId = getSocketIdByUserId(connectUserList, mes.toUserId)
      io.to(toUserSocketId).emit(String(mes.toUserId), toMessageList)
    })
    // 已读消息并更新数据
    socket.on('alreadyRead', async (mes) => {
      await chatService.alreadyRead(mes)
      const list = await getMessageList(mes.toUserId)
      socket.emit(String(mes.toUserId), list)
    })
    console.log('有用户已连接socket')
  })
}
async function getMessageList(userId) {
  const messageList = await chatService.searchAboutMessageByUserId(userId)
  return formatChatMessage(messageList, Number(userId))
}
function getSocketIdByUserId(connectUserList, userId) {
  return connectUserList.find((item) => item.userId === userId)?.socketId
}
module.exports = setupSocket
