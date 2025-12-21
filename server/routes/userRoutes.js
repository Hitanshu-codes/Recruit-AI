import express from "express";
const router = express.Router();
import upload from "../config/multer.js"

import { getUserData, applyForJob, getUserAppliedJobs, updateUserResume } from "../controllers/userController.js";

// get user data
router.get('/user', getUserData)

// apply for a job
router.post('/apply', applyForJob)

// get user applied jobs
router.get('/applied-jobs', getUserAppliedJobs)

// update user resume
router.post('/update-resume', upload.single('resume'), updateUserResume)

export default router;