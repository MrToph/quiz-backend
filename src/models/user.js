import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'user'],
  },
})

UserSchema.pre('save', function userPreSave(next) {
  const user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) {
        next(saltErr)
        return
      }
      bcrypt.hash(user.password, salt, (hashErr, hash) => {
        if (hashErr) {
          return next(hashErr)
        }
        user.password = hash
        return next()
      })
    })
  } else {
    next()
  }
})

UserSchema.methods.comparePassword = function comparePassword(passw, cb) {
  // bcrypt.compare pulls salt out of this.password (=hash(plain_password || salt) || salt), and then uses it to hash passw
  bcrypt.compare(passw, this.password, (err, isMatch) => {
    if (err) cb(err)
    else cb(null, isMatch)
  })
}

export default mongoose.model('User', UserSchema)
