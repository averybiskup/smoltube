import express from 'express'
import next from 'next'
import { createRequire } from 'module'
import axios from 'axios'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import ChannelScheme from './models/channel.js'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

dotenv.config()

// youtube api key
const key = process.env.API_KEY

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

app.prepare().then(() => {
  const server = express()

  const mongoDB = process.env.MONGO_URI
  mongoose.connect(mongoDB)

  const db = mongoose.connection


  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  server.get('/getchannelpid', async (req, res) => {
    const channel = '1Veritasium'
    await getPlaylistID(channel, key, (channel_id) => {
      if (channel_id) {
        res.send(channel_id)
      } else {
        res.send('Bad channel name').status(501)  
      }
    })
  })

  server.get('/getvids', async (req, res) => {
    const channel = '1Veritasium'
    await getPlaylistID(channel, key, (channel_id) => {
      if (channel_id) {
        getRecentVids(channel_id, key, (vid) => {
          res.send(vid)
        })
      } else {
        res.send('Bad channel ID').status(501)  
      }
    })
  })

  server.post('/postchannel', async (req, res) => {
    const channelName = '1Veritasium'
    const channelToInsert = new ChannelScheme({ name: channelName, 
                                                pid: 'oI_X2cMHNe0', 
                                                recentVideos: []})

    channelToInsert.save((err) => {
      console.log('Error inserting document')
      res.send('Failed to insert document').status(501)
    })

    res.send("Document inserted").status(200)
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
