const dotenv = require('dotenv')

dotenv.config()

module.exports = { SERVE_PORT, SERVE_HOST } = process.env
