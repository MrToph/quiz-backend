import express from 'express'
import passport from 'passport'

const apiRoutes = express.Router()

// route to a restricted area, config/passport handles authentication, finds the user and injects it into req.user.
// Otherwise it sends Unauthorized.
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ msg: `Welcome in the member area ${req.user.name}!` })
})

export default apiRoutes
