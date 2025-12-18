// Register a new Company
import Company from '../models/Company.js'
import Job from '../models/Job.js'
import { v2 as cloudinary } from 'cloudinary' // import cloudinary from '../config/cloudinary.js'
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'

// Register a new Company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body
  const imageFile = req.file

  if (!name || !email || !password || !imageFile) return res.status(400).json({ message: "All fields are required" })

  try {
    const companyExist = await Company.findOne({ email })

    if (companyExist) return res.status(400).json({ success: false, message: "Company already exist" })

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const imageUpload = await cloudinary.uploader.upload(imageFile.path)

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      image: imageUpload.secure_url

    })

    if (company) {
      return res.status(200).json({
        success: true, message: "Company registered successfully", company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image
        },
        token: generateToken(company._id)
      })
    }
    else {
      return res.status(400).json({ success: false, message: "Company registration failed" })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }

}

// Login a Company
export const loginCompany = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) return res.status(400).json({ message: "All fields are required" })

  try {
    const company = await Company.findOne({ email })

    if (bcrypt.compare(password, company.password)) {
      res.json({
        success: true,
        message: "Company logged in successfully",
        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          image: company.image
        },
        token: generateToken(company._id)
      })
    }
    else {
      return res.status(400).json({ success: false, message: "Company login failed because of invalid credentials" })
    }

  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// get company data
export const getCompanyData = async (req, res) => {

  try {
    const company = req.company
    return res.status(200).json({ success: true, company })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Server error" })
  }

}


// post a new job
export const postJob = async (req, res) => {
  const { title, location, salary, description, level, category } = req.body;

  const companyId = req.company._id
  // console.log(companyId, { title, location, salary, description })
  try {
    const newJob = new Job({
      title,
      location,
      salary,
      description,
      companyId,
      date: Date.now(),
      level,
      category
    })
    await newJob.save()
    return res.status(200).json({ success: true, message: "Job posted successfully" })
  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }


}

// get company job applicants
export const getJobApplicants = async (req, res) => { }

// get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id
    const jobs = await Job.find({ companyId })
    return res.status(200).json({ success: true, jobsData: jobs })

  }
  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

// change job Application status
export const changeJobApplicationStatus = async (req, res) => { }

// change job visibilty
export const changeJobVisibilty = async (req, res) => {
  try {
    const { id } = req.body
    const companyId = req.company._id
    const job = await Job.findById(id)
    if (companyId.toString() !== job.companyId.toString())
      return res.status(400).json({ success: false, message: "You are not authorized to change this job visibilty" })

    job.visible = !job.visible
    await job.save()
    return res.status(200).json({ success: true, message: "Job visibilty changed successfully", jobData: job })
  }

  catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: error.message })
  }

}

export const updateCompany = async (req, res) => { }