import mongoose from 'mongoose'
import genius from '../genius/api'

const Schema = mongoose.Schema

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
  },
})


ArtistSchema.pre('save', function artistPreSave(next) {
  const artist = this
  if (!artist.url) {
    genius.getArtistUrlByName(artist.name)
    .then((artistUrl) => {
      artist.url = artistUrl
      next()
    })
    .catch((err) => {
      next(err)
    })
  } else {
    next()
  }
})

export default mongoose.model('Artist', ArtistSchema)
