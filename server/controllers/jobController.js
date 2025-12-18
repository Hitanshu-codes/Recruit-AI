
import Job from '../models/Job.js'

// get All jobs
export const getAllJobs = async (req, res) => {

  try {
    const jobs = await Job.find({ visible: true })
      .populate({ path: 'companyId', select: '-password' })

    res.status(200).json({ success: true, jobs })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Server error" })
  }

}


// get job by id
export const getJobById = async (req, res) => {

  try {
    const job = await Job.findById(req.params.id)
      .populate({ path: 'companyId', select: '-password' })

    if (!job) return res.status(404).json({ success: false, message: "Job not found" })

    res.status(200).json({ success: true, job })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

