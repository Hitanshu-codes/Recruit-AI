import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from 'cloudinary'
import { createClerkClient } from '@clerk/backend'
import dotenv from 'dotenv/config'

// Initialize Clerk client (only if secret key is available)
let clerkClient = null
if (process.env.CLERK_SECRET_KEY) {
  clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
} else {
  console.warn('CLERK_SECRET_KEY not found in environment variables')
}

// get user data

export const getUserData = async (req, res) => {
  const { userId } = req.auth()

  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authenticated" })
  }

  try {
    let user = await User.findById(userId)
    if (!user) {
      try {
        // Try to fetch user details from Clerk
        if (!clerkClient) {
          throw new Error('Clerk client not initialized - CLERK_SECRET_KEY missing')
        }

        const clerkUser = await clerkClient.users.getUser(userId)

        // Ensure we have required fields
        const email = clerkUser.emailAddresses?.[0]?.emailAddress || `${userId}@temp.clerk`
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User'
        const image = clerkUser.imageUrl || 'https://via.placeholder.com/150'

        user = await User.create({
          _id: userId,
          name: name,
          email: email,
          image: image,
          resume: "",
        })
        console.log('User created successfully from Clerk data:', userId)
      } catch (clerkError) {
        console.error('Error fetching/creating user from Clerk:', clerkError)
        console.error('Error details:', {
          message: clerkError.message,
          stack: clerkError.stack,
          userId: userId
        })

        // Fallback: Create a minimal user record if Clerk API fails
        // Use a unique email based on userId to avoid conflicts
        try {
          const fallbackEmail = `${userId}@temp.clerk`
          const fallbackImage = 'https://via.placeholder.com/150'

          user = await User.create({
            _id: userId,
            name: 'User',
            email: fallbackEmail,
            image: fallbackImage,
            resume: "",
          })
          console.log('Created fallback user record for:', userId)
        } catch (fallbackError) {
          console.error('Fallback user creation also failed:', fallbackError)
          console.error('Fallback error details:', {
            message: fallbackError.message,
            code: fallbackError.code,
            keyPattern: fallbackError.keyPattern,
            keyValue: fallbackError.keyValue
          })
          return res.status(500).json({
            success: false,
            message: "Error creating user",
            error: process.env.NODE_ENV === 'development' ? fallbackError.message : undefined
          })
        }
      }
    }
    return res.status(200).json({ success: true, user })
  }
  catch (error) {
    console.error('Outer error in getUserData:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    })
    return res.status(500).json({ success: false, message: "Server error" })
  }

}

// apply for a job
export const applyForJob = async (req, res) => {
  try {
    console.log('applyForJob -> headers:', req.headers)
    console.log('applyForJob -> body:', req.body)

    const { jobId } = req.body
    const authObj = typeof req.auth === 'function' ? req.auth() : req.auth
    const userId = authObj?.userId

    console.log('applyForJob -> userId:', userId, 'jobId:', jobId)

    if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' })
    if (!jobId) return res.status(400).json({ success: false, message: 'jobId required' })

    const jobData = await Job.findById(jobId)
    if (!jobData) return res.status(404).json({ success: false, message: 'Job not found' })

    const isAlreadyApplied = await JobApplication.findOne({ jobId, userId })
    if (isAlreadyApplied) return res.status(400).json({ success: false, message: 'You have already applied for this job' })

    const jobApplication = new JobApplication({
      jobId,
      userId,
      companyId: jobData.companyId,
      date: Date.now()
    })

    await jobApplication.save()
    return res.status(200).json({ success: true, message: 'Job applied successfully' })
  } catch (error) {
    console.error('applyForJob error:', error.stack || error)
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? (error.message || error.stack) : undefined
    })
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
    const resumeFile = req.file
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