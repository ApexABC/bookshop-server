const fs = require('fs')
const PRIVATE_KEY = fs.readFileSync('./src/config/keys/private.key')
const PUBLICK_KEY = fs.readFileSync('./src/config/keys/public.key')

module.exports = {
  PRIVATE_KEY,
  PUBLICK_KEY
}
