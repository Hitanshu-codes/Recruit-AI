import express from 'express'
import { getCompanyData, getJobApplicants, loginCompany, postJob, registerCompany, updateCompany, changeJobVisibilty, getCompanyPostedJobs } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// Company login
router.post('/login', loginCompany)

// Get company data
router.get('/company', protectCompany, getCompanyData)

// post a job
router.post('/post-job', protectCompany, postJob)

// get applicants data of company
router.get('/applicants', protectCompany, getJobApplicants)

// Get company posted jobs
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

// change application status
// router.put('/change-status',protectCompany, changeJobApplicationStatus)

// change job visibilty
router.post('/change-visibility', protectCompany, changeJobVisibilty)

export default router