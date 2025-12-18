// Register a new Company
import Company from '../models/Company.js'
import { v2 as cloudinary } from 'cloudinary' // import cloudinary from '../config/cloudinary.js'
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'
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
export const getCompanyData = async (req, res) => { }


// post a new job
export const postJob = async (req, res) => { }

// get company job applicants
export const getJobApplicants = async (req, res) => { }

// get company posted jobs
export const getCompanyPostedJobs = async (req, res) => { }

// change job Application status
export const changeJobApplicationStatus = async (req, res) => { }

// change job visibilty
export const changeJobVisibilty = async (req, res) => { }

export const updateCompany = async (req, res) => { }