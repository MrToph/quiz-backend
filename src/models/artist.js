import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ArtistSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    unique: true,
    required: true,
  },
})

export default mongoose.model('Artist', ArtistSchema)
