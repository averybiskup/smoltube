import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Channel = new Schema({
  name: {
    type: String
  }, 
  pid: {
    type: String
  },
  recentVideos: [String]
})

const ChannelSchema = mongoose.model('concept', Channel)
export default ChannelSchema

