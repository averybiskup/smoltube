import mongoose from 'mongoose'
import dotenv from 'dotenv'
import axios from 'axios'
import ChannelScheme from './models/channel.js'

dotenv.config()

const mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const YOUTUBE_KEY = process.env.API_KEY

const getPlaylistID = async (channel, key, callback) => {
  const getUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channel}&key=${key}`

  axios.get(getUrl)
    .then((res) => {
      const pid = res.data.items[0]['contentDetails']['relatedPlaylists']['uploads']
      callback(pid)
    })
    .catch(err => {
      console.log(err)  
      callback(null)
    })
}

const getRecentVids = async (pid, key, callback) => {
  const maxResults = 1
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${pid}&key=${key}`
  axios.get(playlistUrl)
    .then((res) => {
      const vid = res.data.items[0]['snippet']['resourceId']['videoId']
      callback(vid)
    })
    .catch(err => {
      console.log(err) 
      callback(null)
    })
}

export const getChannelPID = async (req, res) => {
  const channel = '1Veritasium'  
  await getPlaylistID(channel, YOUTUBE_KEY, (channel_id) => {
    if (channel_id) {
      res.send(channel_id)
    } else {
      res.send('Bad channel name').status(501)  
    }
  })
}

export const getVids = async (req, res) => {
  const channel = '1Veritasium'
  await getPlaylistID(channel, YOUTUBE_KEY, (channel_id) => {
    if (channel_id) {
      getRecentVids(channel_id, YOUTUBE_KEY, (vid) => {
        res.send(vid)
      })
    } else {
      res.send('Bad channel ID').status(501)  
    }
  })
}

export const postChannel = async (req, res) => {
  const channelName = '1Veritasium'
  const _user = req.body.user
  const _channelArray = req.body.channelArray

  const channelToInsert = new ChannelScheme({ name: _user, 
                                              pid: 'oI_X2cMHNe0', 
                                              recentVideos: []})

  //await channelToInsert.save((err, data) => {
    //if (err) {
      //console.log('Error inserting document:', err, data)
      //res.status(501).send('Failed to insert document')
    //} else {
      //console.log('Added document')
      //res.status(200).send('Added document')
    //}
  //})
}
