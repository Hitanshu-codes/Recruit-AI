import React, { use, useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets, jobsData } from '../assets/assets'
import Loading from '../components/Loading'
import Navbar from '../components/Navbar'
import kconvert from 'k-convert';
import moment from 'moment'
import JobCard from '../components/JobCard'
import Footer from '../components/Footer'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '@clerk/clerk-react'

import { useNavigate } from 'react-router-dom'


const ApplyJob = () => {
  const { id } = useParams()
  const { getToken } = useAuth()
  const [jobData, setJobData] = useState(null)
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false)
  const navigate = useNavigate()

  const { jobs, backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)
  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`)
      if (data.success) {
        setJobData(data.job)
        toast.success(data.message)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  // apply for a job
  const applyHandler = async () => {
    try {
      if (!userData) {
        toast.error("Please login to apply for a job")
        return
      }
      if (!userData.resume) {
        navigate('/applications') // navigate('/resume')
        toast.error("Upload your resume to apply for a job")
        return
      }
      const token = await getToken()
      // console.log('applyHandler -> token present:', !!token, 'jobId:', id)
      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // console.log('applyHandler -> response:', data)
      if (data.success) {
        toast.success(data.message)
        fetchUserData()
        fetchUserApplications()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error('applyHandler error:', err.response?.data || err.message)
      toast.error(err.response?.data?.message || err.message)
    }
  }
  const checkAlreadyApplied = () => {
    const hasApplied = userApplications.some((job) => job.jobId._id === jobData._id)
    if (hasApplied) {
      setIsAlreadyApplied(true)
    }

  }
  useEffect(() => {
    if (userApplications.length > 0 && jobData) {
      checkAlreadyApplied()
    }
  }, [userApplications, jobData, id])
  useEffect(() => {

    fetchJob()


  }, [id])
  return jobData ? (
    <div>
      <Navbar />
      <div className='min-h-screen flex flex-col py-10 container px-4 2xl:px-20 mx-auto'>
        <div className='bg-white text-black rounded w-full'>
          <div className='flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl'>
            <div className='flex flex-col md:flex-row items-center'>
              <img className='h-24 w-24 rounded-lg p-4 mr-4 max-md:mb-4 ' src={jobData.companyId.image} alt="" />
              <div className='text-center md:text-left text-neutral-700'>
                <h1 className='text-2xl sm:text-4xl font-medium'>{jobData.title}</h1>
                <div className='flex flex-row flex-wrap max-md:justify-center gap-y-2 gap-6 items-center text-gray-600 mt-2'>
                  <span className='flex items-center gap-1'>
                    <img src={assets.suitcase_icon} alt="" />
                    {jobData.companyId.name}
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.location_icon} alt="" />
                    {
                      jobData.location
                    }
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.person_icon} alt="" />
                    {
                      jobData.level
                    }
                  </span>
                  <span className='flex items-center gap-1'>
                    <img src={assets.money_icon} alt="" />
                    CTC:{kconvert.convertTo(jobData.salary, 'INR')}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center'>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded'>{isAlreadyApplied ? 'Already Applied' : 'Apply Now'}</button>
              <p className='mt-1 text-gray-600 '>Posted {moment(jobData.date).fromNow()} </p>
            </div>

          </div>
          <div className='flex flex-col lg:flex-row justify-between items-start'>
            <div className='w-full lg:w-2/3'><h2 className='font-bold text-2xl mb-4'>Job Description</h2>
              <div className='rich-text' dangerouslySetInnerHTML={{ __html: jobData.description }}>
              </div>
              <button onClick={applyHandler} className='bg-blue-600 p-2.5 px-10 text-white rounded mt-10'>{isAlreadyApplied ? 'Already Applied' : 'Apply Now'}</button>
            </div>
            <div className='w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5 flex flex-col items-end'>
              {/* Right Section more jobs */}
              <div className='space-y-5' >
                <h2>More Jobs from {jobData.companyId.name}</h2>
                {jobs.filter(job => job._id !== jobData._id && job.companyId._id === jobData.companyId._id).filter(job => {
                  // set of applied jobs
                  const appliedJobs = new Set(userApplications.map(job => job.jobId._id))
                  return !appliedJobs.has(job._id)
                }).slice(0, 3).map((job, index) => <JobCard job={job} key={index} />)}


              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  ) : (
    <Loading />
  )
}

export default ApplyJob
