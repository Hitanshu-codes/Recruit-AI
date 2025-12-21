import express from 'express'
import cors from 'cors'
import './config/instrument.js'
import companyroutes from './routes/companyRoutes.js'
import jobroutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'

import dotenv from 'dotenv/config'
import { clerkWebhooks } from './controllers/webhooks.js'
import { clerkMiddleware } from '@clerk/express'

// Initialize app
const app = express()

// Connect to DB
import connectDB from './config/db.js'
await connectDB()

// Connect to cloudinary
import connectCloudinary from './config/cloudinary.js'
await connectCloudinary()

// Middleware
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

//routes
app.get('/', (req, res) => {
  res.send('Hello from server')
})

app.post('/webhooks', clerkWebhooks)

app.use('/api/company', companyroutes)

app.use('/api/jobs', jobroutes)

app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app