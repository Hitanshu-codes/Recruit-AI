import express from 'express'
import { getCompanyData, getJobApplicants, loginCompany, postJob, registerCompany, updateCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'

const router = express.Router()

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// Company login
router.post('/login', loginCompany)

// Get company data
router.get('/company', getCompanyData)

// post a job
router.post('/post-job', postJob)

// get applicants data of company
router.get('/applicants', getJobApplicants)

// Get company posted jobs
// router.get('/list-jobs', getCompanyPostedJobs)

// change application status
// router.put('/change-status', changeJobApplicationStatus)

// change job visibilty
// router.put('/change-visibility', changeJobVisibilty)

export default router