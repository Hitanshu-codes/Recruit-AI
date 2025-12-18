import express from 'express'
import { getAllJobs, getJobById } from '../controllers/jobController.js'

const router = express.Router()

// route to get all jobs
router.get('/', getAllJobs)

// route to get job by id
router.get('/:id', getJobById)


export default router