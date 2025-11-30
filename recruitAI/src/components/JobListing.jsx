import React, { use, useState, useEffect } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'


const JobListing = () => {
  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(jobs.length / 6))
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedLocations, setSelectedLocations] = useState([])
  const [filterdJobs, setFilteredJobs] = useState(jobs)
  const handleCategoryChange = (category) => {
    setSelectedCategories(prevCategories => prevCategories.includes(category) ? prevCategories.filter(c => c !== category) : [...prevCategories, category]);
  }
  const handleLocationChange = (location) => {
    setSelectedLocations(prevLocations => prevLocations.includes(location) ? prevLocations.filter(l => l !== location) : [...prevLocations, location]);
  }
  useEffect(() => {
    const matchesCategories = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)
    const matchesLocations = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)
    const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())

    const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())
    const newFilteredJobs = jobs.slice().reverse().filter(job => matchesCategories(job) && matchesLocations(job) && matchesTitle(job) && matchesSearchLocation(job))
    setFilteredJobs(newFilteredJobs)
    setCurrentPage(1)
    setTotalPages(Math.ceil(newFilteredJobs.length / 6))

  }, [selectedCategories, selectedLocations, searchFilter, jobs])

  return (
    <div className='container 2xl:px-20 mx-auto flex flex-col lg:flex-row max-lg: space-y-8 py-8'>
      {/* Sidebar */}
      <div className='w-full lg:w-1/4 bg-white px-4 '>
        {/* Search Filter */}
        {
          isSearched && (searchFilter.title || searchFilter.location) ?
            <div>
              <h3 className='font-medium text-lg mb-4'>Current Search</h3>
              <div className='mb-4 text-gray-600'>
                {searchFilter.title && (
                  <span className='inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded'>
                    {searchFilter.title}
                    <img onClick={e => setSearchFilter(prev => ({ ...prev, title: "" }))} src={assets.cross_icon} className='cursor-pointer' alt="" />
                  </span>
                )}
                {searchFilter.location && (
                  <span className='ml-2 inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded'>
                    {searchFilter.location}
                    <img onClick={e => setSearchFilter(prev => ({ ...prev, location: "" }))} src={assets.cross_icon} className='cursor-pointer' alt="" />
                  </span>
                )}

              </div>
            </div> :
            <div>
              {/* <p>Search for jobs</p> */}
            </div>
        }
        <button onClick={e => setShowFilter(prev => !prev)} className='px-6 py-1.5 rounded border border-gray-400 lg:hidden'>
          {showFilter ? "Close" : "Filters"}
        </button>
        {/* Category Filter */}
        <div className={showFilter ? "block" : "max-lg:hidden"}>
          <h4 className='font-medium text-lg py-4'>Search by Categories</h4>
          <ul className='space-y-4 text-gray-600'>
            {
              JobCategories.map((category, index) => (
                <li key={index} className='flex gap-3 items-center'>
                  <input type="checkbox" className='scale-125' onChange={() => handleCategoryChange(category)}
                    checked={selectedCategories.includes(category)} />
                  <label>{category}</label>
                </li>
              ))
            }
          </ul>
        </div>
        {/* Location Filter */}
        <div className={showFilter ? "block pt-10" : "max-lg:hidden pt-10"}>
          <h4 className='font-medium text-lg py-4'>Search by Locations</h4>
          <ul className='space-y-4 text-gray-600'>
            {
              JobLocations.map((location, index) => (
                <li key={index} className='flex gap-3 items-center'>
                  <input type="checkbox" className='scale-125'
                    onChange={() => handleLocationChange(location)} checked={selectedLocations.includes(location)} />
                  <label>{location}</label>
                </li>
              ))
            }
          </ul>
        </div>



      </div>
      {/* Job Listings */}
      <section className='w-full lg:w-3/4 text-gray-800 max-lg:px-4'>
        <h3 className='font-medium text-3xl py-2' id='job-list'>Latest Jobs</h3>
        <p className='mb-8'>Get your desired job here.</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'>
          {filterdJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
        {/* Pagination */}
        {
          filterdJobs.length > 0 && (
            <div className='flex items-center justify-center mt-10 space-x-2'>
              <button
                type='button'
                aria-label='Previous page'
                disabled={currentPage === 1}
                className='disabled:opacity-50'
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <img src={assets.left_arrow_icon} alt='Previous' />
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <a key={index} href="#job-list" className='mx-4'>
                  <button
                    type='button'
                    onClick={e => setCurrentPage(index + 1)}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${index + 1 === currentPage ? "bg-blue-600 text-gray-200" : ""}`}
                  >
                    {index + 1}
                  </button>
                </a>
              ))}
              <button
                type='button'
                aria-label='Next page'
                disabled={currentPage === totalPages}
                className='disabled:opacity-50'
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <img src={assets.right_arrow_icon} alt='Next' />
              </button>
            </div>
          )}
      </section>
    </div>
  )
}

export default JobListing
