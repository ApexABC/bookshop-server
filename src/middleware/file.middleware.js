const multer = require('@koa/multer')
const upload = multer({
  dest: './uploads'
})
const handleAlbum = upload.single('album')
const handleAvatar = upload.single('avatar')
module.exports = {
  handleAlbum,
  handleAvatar
}
