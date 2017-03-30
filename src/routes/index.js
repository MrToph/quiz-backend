import jwt from 'jwt-simple'
import express from 'express'
import { createError } from './helpers'
import apiRoutes from './api'
import { signingKey } from '../config/secrets'
import User from '../models/user'

const routes = express.Router()

routes.post('/signup', (req, res) => {
  const { email, password, name } = req.body
  if (!email || !name || !password) {
    res.status(400).json(createError('Please pass name, email and password.'))
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
      res.status(400).json(createError(err))
      return
    }
    res.json({ })
  })
})

// route to authenticate a user (POST http://localhost:3001/api/authenticate)
routes.post('/authenticate', (req, res) => {
  const { name, password } = req.body
  if (!name || !password) {
    res.status(400).json(createError('Please pass name and password.'))
    return
  }
  User.findOne({
    name,
  }, (err, user) => {
    if (err) {
      res.status(500).send(createError('Database error.'))
      return
    }

    if (!user) {
      res.status(400).send(createError('Authentication failed. User not found.'))
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
        res.json({ token: `JWT ${token}` })
      } else {
        res.status(400).send(createError('Authentication failed. Wrong password.'))
      }
    })
  })
})

// merge API routes
routes.use('/', apiRoutes)

export default routes
