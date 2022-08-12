import mongoose from 'mongoose'
import dbConnect from '../../lib/dbConnect'

export default async function handler(req, res) {

  console.log('Connecting to DB...')
  await dbConnect()
  console.log('Connected to DB.')
  res.send('Connected')

}
