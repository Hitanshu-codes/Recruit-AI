import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useRef } from 'react'

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext)
  const titleRef = useRef(null)
  const locationRef = useRef(null)

  const onSearch = () => {
    setSearchFilter({ title: titleRef.current.value, location: locationRef.current.value })
    setIsSearched(true)
    console.log({ title: titleRef.current.value, location: locationRef.current.value })
  }
  return (
    <div className='container 2xl: px-20 mx-auto my-10'>
      <div className='bg-linear-to-r  from-purple-800 to bg-purple-950 text-white py-16 text-center mx-2 rounded-xl'>
        <h2 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4'>
          Over 1000+ Jobs Available
        </h2>
        <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5'>Your dream job is just a click away</p>
        <div className='flex items-center justify-center bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto' >
          <div className='flex items-center'>
            <img src={assets.search_icon} alt="Search Icon" className='h-4 sm:h-5' />
            <input type="text" placeholder='Search for jobs' ref={titleRef} className='max-sm:text-xs p-2 rounded outline-none w-full' />
          </div>
          <div className='flex items-center'>
            <img src={assets.location_icon} alt="Location Icon" className='h-4 sm:h-5' />
            <input type="text" placeholder='Search by location' ref={locationRef} className='max-sm:text-xs p-2 rounded outline-none w-full' />
          </div>
          <button onClick={onSearch} className='bg-blue-600 text-white px-1 sm:px-9 py-1 rounded'>Search</button>
        </div>
      </div>
      <div className='border border-gray-300 shadow-md mx-2 mt-5 p-4 rounded-md flex'>
        <div className='flex justify-center gap-8 lg:gap-16 '>
          <p className='font-medium'>Trending Jobs</p>
          <div className='flex flex-wrap justify-center gap-10'>
            <img className='h-6' src={assets.accenture_logo} alt="" />
            <img className='h-6' src={assets.walmart_logo} alt="" />
            <img className='h-6' src={assets.microsoft_logo} alt="" />
            <img className='h-6' src={assets.samsung_logo} alt="" />
            <img className='h-6' src={assets.amazon_logo} alt="" />
            <img className='h-6' src={assets.adobe_logo} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
