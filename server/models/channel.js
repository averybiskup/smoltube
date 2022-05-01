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
}, { collection: 'channels' })

const ChannelSchema = mongoose.model('channels', Channel)
export default ChannelSchema

