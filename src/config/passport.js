import { Strategy, ExtractJwt } from 'passport-jwt'
import User from '../models/user'
import { signingKey } from '../config/secrets'

export default function jwtAuthorize(passport) {
  const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader()
  opts.secretOrKey = signingKey
  passport.use(new Strategy(opts, (jwtPayload, done) => {
    if (!jwtPayload.name) {
      done(null, false)
      return
    }
    // resolve and inject whole User object
    User.findOne({ name: jwtPayload.name }, (err, user) => {
      if (err) {
        done(err, false)
        return
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}
