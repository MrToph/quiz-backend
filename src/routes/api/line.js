import express from 'express'
import passport from 'passport'
import { createError } from '../helpers'
import Line from '../../models/line'

const routes = express.Router()

const linesPerRequest = 30

routes.get('/lines', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { lineStatus } = req.query
  const fromId = req.query.fromId

  let query
  if (fromId) query = Line.find({ active: lineStatus, _id: { $gt: fromId } })
  else query = Line.find({ active: lineStatus })

  query.sort({ _id: 1 })
    .limit(linesPerRequest)
    .exec((err, lines) => {
      if (err) {
        res.status(500).send(createError('Database error.'))
        return
      }

      res.json({ lines })
    })
})

routes.get('/lines/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Line.findOne({ _id: req.params.id }, (err, line) => {
    if (err) {
      res.status(500).send(createError('Database error.'))
      return
    }

    res.json({ line })
  })
})

routes.post('/lines', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { text, artist, songTitle, album, language, moreUrl, active } = req.body
  if (!text || !artist || !songTitle || !language) {
    res.status(400).json(createError('Please pass at least text, artist, songTitle and language.'))
    return
  }

  const newLine = new Line({
    text,
    artist,
    songTitle,
    album,
    language,
    moreUrl,
    active,
  })

  newLine.save((err) => {
    if (err) {
      res.status(400).json(createError(`Database error: ${err}`))
      return
    }
    res.json(newLine)
  })
})

routes.patch('/lines/:lineId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const lineId = req.params.lineId
  const { text, artist, songTitle, album, language, moreUrl, active } = req.body
  if (!lineId || !text || !artist || !songTitle || !language) {
    res.status(400).json(createError('Please pass at least text, artist, songTitle and language.'))
    return
  }

  const updateFields = { text, artist, songTitle, album, language, moreUrl, active }

  Line.findOneAndUpdate({ _id: lineId }, updateFields, { new: true, runValidators: true }, (err, line) => {
    if (err) {
      res.status(500).send(createError(`Database error: ${err}`))
      return
    }

    res.json({ line })
  })
})

routes.delete('/lines/:lineId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const lineId = req.params.lineId
  if (!lineId) {
    res.status(400).json(createError('Please pass lineId.'))
    return
  }

  Line.findOneAndRemove({ _id: lineId }, (err) => {
    if (err) {
      res.status(500).send(createError(`Database error: ${err}`))
      return
    }

    res.json({ })
  })
})


routes.post('/judgeLine/:lineId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const lineId = req.params.lineId
  const { acceptLine } = req.body
  if (typeof acceptLine === 'undefined') {
    res.status(400).json(createError('Please pass at least text, artist, songTitle and language.'))
    return
  }

  if (acceptLine) {
    const updateFields = { active: true }
    Line.findOneAndUpdate({ _id: lineId }, updateFields, { new: true, runValidators: true }, (err) => {
      if (err) {
        res.status(500).send(createError(`Database error: ${err}`))
        return
      }

      res.json({ })
    })
  } else {
    Line.findOneAndRemove({ _id: lineId }, (err) => {
      if (err) {
        res.status(500).send(createError(`Database error: ${err}`))
        return
      }

      res.json({ })
    })
  }
})

export default routes
