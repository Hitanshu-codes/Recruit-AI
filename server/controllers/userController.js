import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from 'cloudinary'

// get user data

export const getUserData = async (req, res) => {
  const { userId } = req.auth

  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ success: false, message: "User not found" })
    return res.status(200).json({ success: true, user })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }

}

// apply for a job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body
  const { userId } = req.auth
  try {
    const isAlreadyApplied = await JobApplication.find({ jobId, userId })
    if (isAlreadyApplied.length > 0) return res.status(400).json({ success: false, message: "You have already applied for this job" })
    const jobData = await Job.findById(jobId)
    if (!jobData) return res.status(404).json({ success: false, message: "Job not found" })

    const jobApplication = new JobApplication({
      jobId,
      userId,
      companyId: jobData.companyId,

      date: Date.now()
    })
    await jobApplication.save()
    return res.status(200).json({ success: true, message: "Job applied successfully" })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// get user applied jobs
export const getUserAppliedJobs = async (req, res) => {
  const { userId } = req.auth
  try {
    const jobs = await JobApplication.find({ userId }).populate('companyId', 'name email image').populate('jobId').exec()

    if (jobs.length === 0) return res.status(404).json({ success: false, message: "No jobs applications found" })

    return res.status(200).json({ success: true, jobs })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// update user profile
export const updateUserResume = async (req, res) => {

  try {
    const userId = req.auth.userId
    const resumeFile = req.resumeFile
    const user = await User.findById(userId)
    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
      user.resume = resumeUpload.secure_url
    }
    await user.save()
    return res.status(200).json({ success: true, message: "Resume updated successfully" })
  } catch (error) {

  }

}