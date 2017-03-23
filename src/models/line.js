import mongoose from 'mongoose'
import ArtistModel from './artist'

const Schema = mongoose.Schema

const LineSchema = new Schema({
  text: {
    type: String,
    required: true,
    unique: true,
  },
  artist: {
    type: String,
    required: true,
  },
  songTitle: {
    type: String,
    required: true,
  },
  album: {
    type: String,
  },
  language: {
    type: String,
    required: true,
    enum: ['en', 'de'],
  },
  moreUrl: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
    required: true,
  },
  upvotes: {
    type: Number,
    default: 0,
    required: true,
  },
  downvotes: {
    type: Number,
    default: 0,
    required: true,
  },
})

LineSchema.path('artist').validate((value, respond) => {
  ArtistModel.findOne({ name: value }, (err, doc) => {
    if (err || !doc) {
      respond(false)
    } else {
      respond(true)
    }
  })
}, 'Artist does not exist')

export default mongoose.model('Line', LineSchema)
