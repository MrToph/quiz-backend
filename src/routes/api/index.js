import express from 'express'
import artistRoutes from './artist'
import lineRoutes from './line'

const apiRoutes = express.Router()

// route to a restricted area, config/passport handles authentication, finds the user and injects it into req.user.
// Otherwise it sends Unauthorized.
// apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.json({ msg: `Welcome in the member area ${req.user.name}!` })
// })

// merge API routes
apiRoutes.use('/', artistRoutes)
apiRoutes.use('/', lineRoutes)

export default apiRoutes
