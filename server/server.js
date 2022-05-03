import express from 'express'
import next from 'next'
import { getChannelPID, 
         getVids, 
         postChannel } from './controller.js'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.get('/getchannelpid', getChannelPID)
  server.get('/getvids',       getVids)

  server.post('/postchannels', postChannel)

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
