const dotenv = require('dotenv')

dotenv.config()

module.exports = { SERVE_PORT, SERVE_HOST, MYSQL_HOST, MYSQL_PORT } = process.env
