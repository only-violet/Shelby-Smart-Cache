import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { uploadToShelby, fetchFromShelby } from './shelbyClient.js'
import { trackRead, getStats, getAllStats } from './readTracker.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())

let db = {}


app.post('/upload', async (req, res) => {
  const { content } = req.body

  const id = await uploadToShelby(content)

  db[id] = {
    content,
    createdAt: Date.now()
  }

  res.json({ id })
})

app.get('/read/:id', async (req, res) => {
  const { id } = req.params

  trackRead(id)

  const data = await fetchFromShelby(id)

  res.json({
    id,
    data,
    reads: getStats(id)
  })
})


app.get('/stats', (req, res) => {
  const stats = getAllStats()

  const result = Object.keys(stats).map(id => ({
    id,
    reads: stats[id],
    status: stats[id] > 5 ? 'HOT' : 'COLD',
    reward: stats[id] * 0.01
  }))

  res.json(result)
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
