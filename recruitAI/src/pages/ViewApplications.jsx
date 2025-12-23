import React, { useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'

import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext)
  const [applicants, setApplicants] = useState([])
  // funct to fetch company Job Application data
  const fetchCompanyJobApplicants = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/applicants`, { headers: { token: companyToken } })
      if (data.success) {
        setApplicants(data.applications?.reverse())
        console.log(data)
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  // Function to change the application status
  const changeApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/company/change-status`, { id, status }, { headers: { token: companyToken } })
      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobApplicants()
      }
      else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCompanyJobApplicants()
  }, [companyToken])
  return applicants ? applicants.length === 0 ? <div className='container mx-auto p-4'>No applications found</div> : (
    <div className='container mx-auto p-4'>
      <div>
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User Name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.filter(item => item.jobId && item.userId).map((item, index) => (
              <tr key={index} className='text-gray-700'>
                <td className='py-2 px-4 border-b text-center'>{index + 1}</td>
                <td className='py-2 px-4 border-b text-center flex '><img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={item.userId.image} alt="" />
                  <span>{item.userId.name}</span></td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{item.jobId.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{item.jobId.location}</td>
                <td className='py-2 px-4 border-b'><a className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center' href={item.userId.resume} target='_blank'>
                  Resume <img src={assets.resume_download_icon} alt="" /></a></td>

                <td className='py-2 px-4 border-b relative'>
                  {item.status === "Pending" ? <div className='relative inline-block text-left group'>

                    <button className='text-gray-500 action-button'>...</button>
                    <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                      <button onClick={() => changeApplicationStatus(item._id, 'accepted')} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>
                        Accept
                      </button>
                      <button onClick={() => changeApplicationStatus(item._id, 'rejected')} className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>
                        Reject
                      </button>
                    </div>
                  </div> :
                    <div className='relative inline-block text-left group'>
                      <button className='text-gray-700 action-button'>{item.status}</button>
                    </div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : <div className='container mx-auto p-4'>Loading...</div>
}

export default ViewApplications
