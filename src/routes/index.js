import jwt from 'jwt-simple'
import express from 'express'
import apiRoutes from './api'
import { signingKey } from '../config/secrets'
import User from '../models/user'

const routes = express.Router()

routes.post('/signup', (req, res) => {
  const { email, password, name } = req.body
  if (!email || !name || !password) {
    res.json({ success: false, msg: 'Please pass name, email and password.' })
    return
  }

  const newUser = new User({
    name,
    password,
    email,
  })
  // save the user
  newUser.save((err) => {
    if (err) {
      res.json({ success: false, msg: 'Username or email already exists.' })
      return
    }
    res.json({ success: true, msg: 'Successful user creation.' })
  })
})

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
routes.post('/authenticate', (req, res) => {
  const { name, password } = req.body
  if (!name || !password) {
    res.json({ success: false, msg: 'Please pass name, email and password.' })
    return
  }
  User.findOne({
    name,
  }, (err, user) => {
    if (err) {
      res.status(500).send({ success: false, msg: 'Database error.' })
      return
    }

    if (!user) {
      res.send({ success: false, msg: 'Authentication failed. User not found.' })
      return
    }

    // check if password matches
    user.comparePassword(password, (pwdErr, isMatch) => {
      if (isMatch && !pwdErr) {
        // if user is found and password is right create a token that identifies the unique user
        const token = jwt.encode({
          name: user.name,
        }, signingKey)
        // return the information including token as JSON
        res.json({ success: true, token: `JWT ${token}` })
      } else {
        res.send({ success: false, msg: 'Authentication failed. Wrong password.' })
      }
    })
  })
})

// merge API routes
routes.use('/', apiRoutes)

export default routes
