const mysql = require('mysql2')
const { MYSQL_HOST, MYSQL_PORT } = require('../config/serve')
const connectionPoll = mysql.createPool({
  host: `${MYSQL_HOST}`,
  port: `${MYSQL_PORT}`,
  database: 'bookshop',
  user: 'root',
  // password: 'Mysql123!',
  password: '123456789',
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
