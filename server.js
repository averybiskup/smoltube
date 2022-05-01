import express from 'express'
import next from 'next'
import { createRequire } from 'module'
import axios from 'axios'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const require = createRequire(import.meta.url)
const key = require('./key.json')

const getPlaylistID = async (channel, key, callback) => {
  const getUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channel}&key=${key['api_key']}`

  axios.get(getUrl)
    .then((res) => {
      callback(res.data.items[0]['contentDetails']['relatedPlaylists']['uploads'])
    })
    .catch(err => {
      console.log(err)  
      callback(null)
    })
}

const getRecentVids = async (pid, key, callback) => {
  const maxResults = 1
  const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${pid}&key=${key['api_key']}`
  axios.get(playlistUrl)
    .then((res) => {
      const vid = res.data.items[0]['snippet']['resourceId']['videoId']
      callback(vid)
    })
    .catch(err => {
      console.log(err) 
    })
}

app.prepare().then(() => {
  const server = express()

  server.get('/getchannelpid', async (req, res) => {
    const channel = '1Veritasium'
    await getPlaylistID(channel, key, (channel_id) => {
      if (channel_id) {
        res.send(channel_id) 
      } else {
        res.send('Bad channel ID').status(501)  
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

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
