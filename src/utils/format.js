function formatChatMessage(mesList, userId) {
  const res = []
  for (const item of mesList) {
    let targetUserId
    let targetUserName
    let targetUserAvatar
    if (item.fromUserId === userId) {
      targetUserId = item.toUserId
      targetUserName = item.toUsername
      targetUserAvatar = item.toAvatar
    } else {
      targetUserId = item.fromUserId
      targetUserName = item.fromUsername
      targetUserAvatar = item.fromAvatar
    }
    const index = res.findIndex((i) => i.targetUserId === targetUserId)
    if (index !== -1) {
      // 已经存过
      if (item.isRead === 0 && item.toUserId === userId) res[index].unRead++
      res[index].updateTime = item.createTime
      res[index].messageList.push({
        fromUserId: item.fromUserId,
        toUserId: item.toUserId,
        message: item.message,
        isRead: item.isRead,
        createTime: item.createTime
      })
    } else {
      // 第一次存储目标联系人
      res.push({
        targetUserId,
        targetUserName,
        targetUserAvatar: `${SERVE_HOST}:${SERVE_PORT}/uploads/${targetUserAvatar}`,
        unRead: item.isRead === 0 && item.toUserId === userId ? 1 : 0,
        updateTime: item.createTime,
        messageList: [
          {
            fromUserId: item.fromUserId,
            toUserId: item.toUserId,
            message: item.message,
            isRead: item.isRead,
            createTime: item.createTime
          }
        ]
      })
    }
  }
  //   const selfIndex = res.findIndex((i) => i.targetUserId === userId)
  //   res.splice(selfIndex, 1)
  return res
}
module.exports = {
  formatChatMessage
}
