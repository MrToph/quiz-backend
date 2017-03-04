import express from 'express'
import passport from 'passport'
import { createError } from './helpers'
import Artist from '../models/artist'

const apiRoutes = express.Router()

// route to a restricted area, config/passport handles authentication, finds the user and injects it into req.user.
// Otherwise it sends Unauthorized.
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ msg: `Welcome in the member area ${req.user.name}!` })
})

/* ************* */
/* ** ARTISTS ** */
/* ************* */
apiRoutes.get('/artists', passport.authenticate('jwt', { session: false }), (req, res) => {
  Artist.find({}, (err, artists) => {
    if (err) {
      res.status(500).send(createError('Database error.'))
      return
    }

    res.json({ artists })
  })
})

apiRoutes.get('/artists/:artistName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Artist.findOne({ name: req.params.artistName }, (err, artist) => {
    if (err) {
      res.status(500).send(createError('Database error.'))
      return
    }

    res.json({ artist })
  })
})

apiRoutes.post('/artists', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { name, url } = req.body
  if (!name || !url) {
    res.status(400).json(createError('Please pass name and url.'))
    return
  }

  const newArtist = new Artist({
    name,
    url,
  })

  newArtist.save((err) => {
    if (err) {
      res.status(400).json(createError('Name or URL already exists.'))
      return
    }
    res.json({ })
  })
})

apiRoutes.patch('/artists/:artistName', passport.authenticate('jwt', { session: false }), (req, res) => {
  const oldName = req.params.artistName
  const { name, url } = req.body
  if (!oldName || !name || !url) {
    res.status(400).json(createError('Please pass old name, new name and url.'))
    return
  }

  const updateFields = {
    name,
    url,
  }

  Artist.findOneAndUpdate({ name: oldName }, updateFields, { new: true }, (err, artist) => {
    if (err) {
      res.status(500).send(createError(`Database error: ${err}`))
      return
    }

    res.json({ artist })
  })
})

apiRoutes.delete('/artists/:artistName', passport.authenticate('jwt', { session: false }), (req, res) => {
  const name = req.params.artistName
  if (!name) {
    res.status(400).json(createError('Please pass name.'))
    return
  }

  Artist.findOneAndRemove({ name }, (err) => {
    if (err) {
      res.status(500).send(createError(`Database error: ${err}`))
      return
    }

    res.json({ })
  })
})

export default apiRoutes
