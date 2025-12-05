import express from 'express'
import cors from 'cors'
import './config/instrument.js'

import dotenv from 'dotenv/config'
import { clerkWebhooks } from './controllers/webhooks.js'

// Initialize app
const app = express()

// Connect to DB
import connectDB from './config/db.js'
await connectDB()

// Middleware
app.use(cors())
app.use(express.json())

//routes
app.get('/', (req, res) => {
  res.send('Hello from server')
})

app.post('/webhooks', clerkWebhooks)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app