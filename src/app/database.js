const mysql = require('mysql2')
const connectionPoll = mysql.createPool({
  host: '120.79.3.170',
  port: 3306,
  database: 'bookshop',
  user: 'root',
  password: 'Mysql123!',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})
// 获取连接是否成功
connectionPoll.getConnection((err, connection) => {
  if (err) {
    console.log('数据库连接失败', err)
    return
  }
  connection.connect((err) => {
    if (err) {
      console.log('数据库交互失败', err)
    } else {
      console.log('数据库连接成功')
    }
  })
})
const connection = connectionPoll.promise()

module.exports = connection
