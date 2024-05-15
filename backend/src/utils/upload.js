import multer from 'multer'
import path from 'path'

const storageProfPic = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/profPic')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/posts')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

export const uploadProfPic = multer({ storage: storageProfPic })

export const uploadPost = multer({ storage: storagePost })
