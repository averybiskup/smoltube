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
const channel = '1Veritasium'

const get_url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channel}&key=${key['api_key']}`

app.prepare().then(() => {
  const server = express()

  server.get('/get_vids', async (req, res) => {
    axios.get(get_url)
      .then((res) => {
        console.log(res.data.items[0]['contentDetails']['relatedPlaylists']['uploads'])
      })
      .catch(err => {
        console.log(err)  
      })
    res.send("HELLO")
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
