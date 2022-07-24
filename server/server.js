import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import { getChannelPID, 
         getVids, 
         postChannel,
         login,
         signup,
         addChannels,
         getSubs } from './controller.js'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const jsonParser = bodyParser.json()

app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json())

  server.get('/getchannelpid', getChannelPID)
  server.get('/getvids',       getVids)
  server.get('/getsubs', getSubs)

  server.post('/postchannels', postChannel)
  server.post('/addchannels', addChannels)
  server.post('/signup', signup)
  server.get('/login', login)

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
