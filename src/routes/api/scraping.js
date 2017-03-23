import express from 'express'
import passport from 'passport'
import { createError } from '../helpers'
import Line from '../../models/line'

const routes = express.Router()

routes.get('/scrape/fillWithTestLines', passport.authenticate('jwt', { session: false }), (req, res) => {
  for (let i = 0; i < 250; i += 1) {
    const newLine = new Line({
      text: `Sample Text ${i}`,
      artist: 'KIZ',
      songTitle: 'Sample Song',
      language: 'de',
      moreUrl: `http://kiz.com/${i}`,
      active: false,
    })

    newLine.save((err) => {
      if (err) {
        res.status(400).json(createError(`Database error: ${err}`))
      }
    })
  }
  res.json({})
})

routes.post('/scrape/popular', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { artistNames, numberOfSongsToParse } = req.body
  if (!artistNames || !numberOfSongsToParse) {
    res.status(400).json(createError('Please pass both "artistNames" and "numberOfSongsToParse".'))
    return
  }

  // TODO implement
  console.log('popular', artistNames, numberOfSongsToParse)

  res.json({})
})

routes.post('/scrape/date', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { artistNames, timestampToParseFrom } = req.body
  if (!artistNames || !timestampToParseFrom) {
    res.status(400).json(createError('Please pass both "artistNames" and "timestampToParseFrom".'))
    return
  }

  // TODO implement
  console.log('date', artistNames, timestampToParseFrom, new Date(timestampToParseFrom).toLocaleDateString())

  res.json({})
})

export default routes

